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
        timeout: 30000,
        puppeteerOptions: {
            headless: true
        }
    });
    // Event handler to be called in case of problems
    cluster.on('taskerror', (err, data) => {
        console.log(`Exception in ${data}: ${err.message}`);
    });

    await cluster.task(async ({
                                  page,
                                  data: url
                              }) => {
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image') {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 0
        });

        let firstName = faker.name.firstName();
        let email = faker.internet.email();

        await page.waitForSelector("#sow-button-3 > div > div > a");
        await page.click("#sow-button-3 > div > div > a");

        await page.evaluate(() => {
            document.querySelector('span.your-name').click()
        });
        await page.type('#wpcf7-f2983-o1 > form > p > label:nth-child(1) > span > input', `${firstName}`);
        await page.evaluate(() => {
            document.querySelector('span.your-email').click()
        });
        await page.type('#wpcf7-f2983-o1 > form > p > label:nth-child(3) > span > input', `${email}`);

        await page.evaluate(() => {
            document.querySelector('input.wpcf7-submit').click()
        });

        console.log(`Subscription Form Submitted: ${firstName}: ${email}`);
    });

    for (let i = 0; i < 1000000; i++) {
        cluster.queue(Buffer.from("aHR0cHM6Ly93d3cuYnJpYW5jaGFtb3RpdmF0aW9uLmNvbS8lZTglODElYWYlZTclYjUlYTElZTYlODglOTElZTUlODAlOTEv", 'base64').toString('binary'))

    }
    console.log(`Current Public IP: ${await publicIp.v4()}`)

    await cluster.idle();
    await cluster.close();
}

main().then(response => console.log(response));


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