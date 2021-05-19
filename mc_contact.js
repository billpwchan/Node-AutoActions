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
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 0
        });
        // await page.setViewport({
        //     width: 1920,
        //     height: 1080
        // });
        // await autoScroll(page)
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image') {
                req.abort();
            } else {
                req.continue();
            }
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
        await page.type("#email", faker.internet.email(firstName, lastName))

        await page.type("#\\30 0N2400000D0zJI", faker.internet.userName())

        let password = faker.internet.password()
        await page.type("#password", password)
        await page.type("#password_", password)

        university = [
            "Aberdeen",
            "Abertay Dundee",
            "Aberystwyth",
            "Anglia Ruskin",
            "Arts University Bournemouth",
            "Aston",
            "Bangor",
            "Bath",
            "Bath Spa",
            "Bedfordshire",
            "Birkbeck College",
            "Birmingham",
            "Birmingham City",
            "Bishop Grosseteste",
            "Bolton",
            "Bournemouth",
            "Bradford",
            "Brighton",
            "Bristol",
            "Brunel",
            "Buckingham",
            "Buckinghamshire New",
            "Cambridge",
            "Canterbury Christ Church",
            "Cardiff",
            "Cardiff Metro",
            "Central Lancashire",
            "Chester",
            "Chichester",
            "City",
            "City of London University CASS",
            "Conservatoire for Dance and Drama",
            "Courtauld Institute of Art",
            "Coventry",
            "Cranfield",
            "Cumbria",
            "De Montfort",
            "Derby",
            "Dundee",
            "Durham",
            "East Anglia",
            "East London",
            "Edge Hill",
            "Edinburgh",
            "Edinburgh Napier",
            "Essex",
            "Exeter",
            "Falmouth",
            "Glasgow",
            "Glasgow Caledonian",
            "Glasgow School of Art",
            "Gloucestershire",
            "Glyndwr",
            "Goldsmiths College",
            "Greenwich",
            "Guildhall School of Music and Drama",
            "Hatfield",
            "Harper Adams",
            "Heriot – Watt",
            "Hertfordshire",
            "Heythrop",
            "Highlands and Islands",
            "Huddersfield",
            "Hull",
            "Imperial College London",
            "Institute of Cancer Research",
            "Institute of Education",
            "Keele",
            "Kent",
            "King’s College London",
            "Kingston",
            "Lancaster",
            "Leeds",
            "Leeds Beckett",
            "Leeds College of Art",
            "Leeds Trinity",
            "Leicester",
            "Lincoln",
            "Liverpool",
            "Liverpool Hope",
            "Liverpool John Moores",
            "London Business School",
            "London Metropolitan University",
            "London School of Economics",
            "London School of Hygiene and Tropical Medicine",
            "London South Bank",
            "Loughborough",
            "Manchester",
            "Manchester Metropolitan",
            "Middlesex",
            "National Film and Television School",
            "Newcastle – upon – Tyne",
            "Newman",
            "Northampton",
            "Northumbria",
            "Norwich University of the Arts",
            "Nottingham",
            "Nottingham Trent",
            "Open University",
            "Oxford",
            "Oxford Brookes",
            "Plymouth",
            "Portsmouth",
            "Queen Margaret",
            "Queen Mary",
            "Ravensbourne",
            "Reading",
            "Robert Gordon",
            "Roehampton",
            "Royal Academy of Music",
            "Royal Agricultural University",
            "Royal Central School of Speech and Drama",
            "Royal College of Art",
            "Royal College of Music",
            "Royal Conservatoire of Scotland",
            "Royal Holloway",
            "Royal Northern College of Music",
            "Royal Veterinary College",
            "Salford",
            "School of Oriental and African Studies",
            "Sheffield",
            "Sheffield Hallam",
            "Southampton",
            "Southampton Solent",
            "South Wales",
            "SRUC",
            "Staffordshire",
            "St Andrews",
            "St George’s Hospital Medical School",
            "Stirling",
            "St Mary & #39;s University Twickenham",
            "Strathclyde",
            "Sunderland",
            "Surrey",
            "Sussex",
            "Swansea",
            "Teesside",
            "Trinity Laban Conservatoire of Music and Dance",
            "University Campus Suffolk",
            "University College Birmingham",
            "University College London",
            "University for the Creative Arts",
            "University of the Arts",
            "Wales Trinity Saint David",
            "Warwick",
            "West London",
            "Westminster",
            "West of England",
            "West of Scotland",
            "Winchester",
            "Writtle College",
            "York",
            "York St John",
            "Other(please indicate)",
            "Baruch",
            "Binghamton",
            "Boston University",
            "Drexel",
            "Fairley Dickenson",
            "Fordham",
            "Hofstra",
            "John Hopkins University",
            "NYIT",
            "NYU",
            "Pace",
            "Rutgers",
            "Saint Johns",
            "Stevens",
            "Stony Brook",
            "SUNY Albany",
            "Syracuse",
            "Temple",
            "USC(University of South California)",
            "UCLA(University of California Los Angeles)",
            "UCI(University of California, Irvine)",
            "Others"
        ]
        // get random index value
        randomIndex = Math.floor(Math.random() * university.length);
        await page.select("#\\30 0N2400000BpoJI", university[randomIndex])

        lead_source = [
            "Campus Assistant",
            "Campus Visit",
            "Facebook",
            "Google / Other Search",
            "Ref Candidate",
            "Ref Friend",
            "Seminar",
            "Seminar Campus Assistant",
            "Sina Weibo",
            "Web Registration",
            "WeChat",
            "Career Fair",
            "Word of mouth",
            "Webinar",
            "Other"
        ]
        randomIndex = Math.floor(Math.random() * lead_source.length);
        await page.select("#lead_source", lead_source[randomIndex])
        await page.click("#__privacy")
        await page.waitForTimeout(1000)

        await page.click('#salesforce_form_register [name="submit"]')
        console.log(`Registration Complete: ${firstName} ${lastName}`)

        await page.goto(Buffer.from("aHR0cHM6Ly9ib29rbWFuZGFyaW4ud3Vmb28uY29tL2Zvcm1zL3pndXhubmYxc3lwdDUyLw==", 'base64').toString('binary'), {
            waitUntil: 'networkidle0',
            timeout: 0
        });

        await page.waitForSelector('#Field129');
        await page.select('#Field129', 'Other');

        await page.type('#Field489', `${firstName} ${lastName}`);
        await page.type('#Field165', txtgen.sentence());
        await page.type('#Field161', txtgen.article());
        await page.type('#Field5', txtgen.article());

        await page.click('#saveForm');
        await page.waitForTimeout(1000);
    });

    for (let i = 0; i < 100000; i++) {
        cluster.queue(Buffer.from("aHR0cHM6Ly93d3cubWNpd29ybGR3aWRlLmNvLnVrLw==", 'base64').toString('binary'))
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