'use strict';

exports.sendGridVerify = (jobAppArr) => {

  let emailReceiver = '';
  let emailContent = '';

  jobAppArr.forEach( c => {
    ( emailReceiver == '') ? emailReceiver = c : emailContent += ' ' + c;
  });

  let helper = require('sendgrid').mail;

  let from_email = new helper.Email("admin@jsm.com");
  let to_email = new helper.Email(emailReceiver);
  let subject = "You haven't been received feed back for 7 days";
  let content = new helper.Content("text/plain", `You haven't been received feed back for 7 days ${emailContent}`);
  let mail = new helper.Mail(from_email, subject, to_email, content);

  let sg = require('sendgrid').SendGrid(process.env.SENDGRID_JMS_API_KEY);
  let requestBody = mail.toJSON();
  let request = sg.emptyRequest();

  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body = requestBody;
  sg.API(request, (response) => {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  })
}
