const faker = require('faker');
var randomName = require("chinese-random-name");
const university = ["University of Oxford", "University of Cambridge", "Imperial College London", "University College London", "London School of Economics and Political Science", "University of Edinburgh", "King’s College London", "University of Manchester", "University of Bristol", "University of Glasgow", "University of Southampton", "University of Birmingham", "Queen Mary, University of London", "University of Warwick", "The University of Sheffield", "University of Liverpool", "The University of Nottingham", "University of Leeds", "University of Exeter"]
const lead_source = ["LinkedIn领英", "Google/other search", "University seminars", "WeChat", "Sina Weibo", "Facebook", "Other events", "Friends", "Other"]
const url = Buffer.from("aHR0cDovL3d3dy5tY2l3b3JsZHdpZGUuY29tLmNuL3JlZ19zYXZlMi5waHA/SG9zdD0gd3d3Lm1jaXdvcmxkd2lkZS5jb20uY24mQ29ubmVjdGlvbj0ga2VlcC1hbGl2ZSZDb250ZW50LUxlbmd0aD0gMjU3JkNhY2hlLUNvbnRyb2w9IG1heC1hZ2U9MCZPcmlnaW49IGh0dHA6Ly93d3cubWNpd29ybGR3aWRlLmNvbS5jbiZVcGdyYWRlLUluc2VjdXJlLVJlcXVlc3RzPSAxJkROVD0gMSZDb250ZW50LVR5cGU9IGFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCZVc2VyLUFnZW50PSBNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvOTAuMC40NDMwLjIxMiBTYWZhcmkvNTM3LjM2JkFjY2VwdD0gdGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksaW1hZ2UvYXZpZixpbWFnZS93ZWJwLGltYWdlL2FwbmcsKi8qO3E9MC44LGFwcGxpY2F0aW9uL3NpZ25lZC1leGNoYW5nZTt2PWIzO3E9MC45JlJlZmVyZXI9IGh0dHA6Ly93d3cubWNpd29ybGR3aWRlLmNvbS5jbi9yZWcucGhwJkFjY2VwdC1FbmNvZGluZz0gZ3ppcCwgZGVmbGF0ZSZBY2NlcHQtTGFuZ3VhZ2U9IGVuLVVTLGVuO3E9MC45", 'base64').toString('binary')
var axios = require('axios');
var FormData = require('form-data');

const sendPostRequest = async () => {

    var fullName = randomName.generate();
    // get random index value
    var randomIndex_uni = Math.floor(Math.random() * university.length);
    var randomIndex_lead = Math.floor(Math.random() * lead_source.length);
    var password = faker.internet.password()

    var email = faker.internet.email();


    var data = new FormData();
    data.append('FirstName', fullName);
    data.append('University', '英国');
    data.append('uk', university[randomIndex_uni]);
    data.append('Email', email);
    data.append('wechatid', faker.internet.userName());
    data.append('Phone', faker.phone.phoneNumber('1##########'));
    data.append('knowabout', lead_source[randomIndex_lead]);
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
            console.log(JSON.stringify(response.data));
            console.log(`Registration Complete: ${fullName} - ${email} - ${password}`)
        })
        .catch(function (error) {
            console.log(error);
        });
}

setInterval(sendPostRequest, 1000);