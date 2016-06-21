'use strict';

const twilio = require('twilio');

exports.twilioNofication = (jobAppArr) => {

  const TWILIO_ACCOUNTSID = process.env.TWILIO_ACCOUNTSID;
  const TWILIO_AUTHTOKEN = process.env.TWILIO_AUTHTOKEN;
  const TWILIO_FROM = process.env.TWILIO_FROM;

  const client = require('twilio')(TWILIO_ACCOUNTSID, TWILIO_AUTHTOKEN);

  let phoneReceiver = '';
  let phoneContent = '';

  jobAppArr.forEach( c => {
    ( phoneReceiver == '') ? phoneReceiver = c : phoneContent += ' ' + c;
  });

  let twilioto = phoneReceiver;
  let twiliobody = phoneContent;

  client.messages.create({
    to: twilioto,
    from: TWILIO_FROM,
    body: twiliobody
  },  (err, message) => {
    //res.status(err ? 400 : 200).send(err);
  });
}
