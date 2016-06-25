'use strict';

exports.sendGridNotification = (jobAppArr, cb) => {

    let emailReceiver = jobAppArr.userEmail;
    let emailSubject = jobAppArr.subject;
    let emailContent = jobAppArr.message;

    let helper = require('sendgrid').mail;

    let from_email = new helper.Email("admin@jsm.com");
    let to_email = new helper.Email(emailReceiver);
    let subject = 'emailSubject will be implement' + emailSubject;
    let content = new helper.Content("text/plain", 'email content will be implement' + emailContent);
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

    cb(null, request);
}
