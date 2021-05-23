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
var randomName = require("chinese-random-name");

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
        timeout: 1000000,
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
        // Catch all failed requests like 4xx..5xx status codes
        // page.on('requestfailed', request => {
        //     console.log(`url: ${request.url()}, errText: ${request.failure().errorText}, method: ${request.method()}`)
        // });

        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image') {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.setViewport({
            'width': 1920,
            'height': 1080
        });

        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 0
        });
        await page.waitForSelector("#FirstName")
        await page.click("#FirstName")

        fullName = randomName.generate()
        await page.type("#FirstName", fullName)

        await page.type("#Phone", faker.phone.phoneNumber('1##########'))

        let email = faker.internet.email();
        await page.type("#Email", email);

        await page.type("#wechatid", faker.internet.userName())

        university = ["University of Oxford", "University of Cambridge", "Imperial College London", "University College London", "London School of Economics and Political Science", "University of Edinburgh", "King’s College London", "University of Manchester", "University of Bristol", "University of Glasgow", "University of Southampton", "University of Birmingham", "Queen Mary, University of London", "University of Warwick", "The University of Sheffield", "University of Liverpool", "The University of Nottingham", "University of Leeds", "University of Exeter"]
        // get random index value
        randomIndex = Math.floor(Math.random() * university.length);
        await page.select("select#uk", university[randomIndex])

        lead_source = ["LinkedIn领英", "Google/other search", "University seminars", "WeChat", "Sina Weibo", "Facebook", "Other events", "Friends", "Other"]
        randomIndex = Math.floor(Math.random() * lead_source.length);
        await page.select("#knowabout", lead_source[randomIndex])

        let password = faker.internet.password()
        await page.type("#password", password)
        await page.type("#password2", password)

        await page.click('#login_frame > ul.form > form > li.submit > input[type=submit]')
        console.log(`Registration Complete: ${fullName} - ${email} - ${password}`)

        await page.waitForTimeout(1000)
    });

    for (let i = 0; i < 100000; i++) {
        cluster.queue(Buffer.from("aHR0cDovL3d3dy5tY2l3b3JsZHdpZGUuY29tLmNuL3JlZy5waHA=", 'base64').toString('binary'))
        // cluster.queue(Buffer.from("aHR0cDovL3d3dy5tY2l3b3JsZHdpZGUuY29tLmNuLw==", 'base64').toString('binary'))
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