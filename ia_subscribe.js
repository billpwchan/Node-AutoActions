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
        maxConcurrency: 1,
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
        data: url
    }) => {
        // Catch all failed requests like 4xx..5xx status codes
        page.on('requestfailed', request => {
            console.log(`url: ${request.url()}, errText: ${request.failure().errorText}, method: ${request.method()}`)
        });

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
        let lastName = faker.name.lastName();

        await page.type('#wpcf7-f85-p12-o1 > form > div.content > div.field_item.field_name > span > input', `${firstName} ${lastName}`)
        await page.type('#wpcf7-f85-p12-o1 > form > div.content > div.field_item.field_email > span > input', faker.internet.email(firstName, lastName));
        await page.click('#wpcf7-f85-p12-o1 > form > div.content > div.submit_row > input');

        await page.type('#mc4wp-form-1 > div.mc4wp-form-fields > div > div > input[type=email]', faker.internet.email(firstName, lastName));
        await page.click('#mc4wp-form-1 > div.mc4wp-form-fields > div > button');
    });

    for (let i = 0; i < 100000; i++) {
        cluster.queue(Buffer.from("aHR0cHM6Ly9pc3RlbS5haS8=", 'base64').toString('binary'))
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