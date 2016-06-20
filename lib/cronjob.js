"use strict";

const CronJob = require('cron').CronJob;
const Application = require('../models/application');
const SendGrid = require('../lib/sendgrid');
const Twilio = require('../lib/twilio');

// const dailyBaseCronJobNotification = () => {
exports.dailyBaseCronJobNotification = () => {

   new CronJob('* * * * * *', () => {
   // new CronJob('00 30 11 * * 0-6', () => {

      let jobApp = {};
      let jobAppArr = [];
      Application.getFeedbackDateList((err, jobApp) => {

         if (jobApp.length) {
            jobApp.forEach( function(c) {

               if (c.applicant[0] != 'undefind' || c.applicant[0] != null != c.applicant[0] != '') {

                  console.log('c.applicant[0]', c.applicant[0]);

                  const notifyType = 'email';  //phone
                  let exist = false;

                  if (notifyType === 'email') {
                     exist = jobAppArr.some( emailExist => {
                        return (emailExist === c.applicant[0].email)
                     } );

                     if (!exist) jobAppArr.push(c.applicant[0].email);

                  } else {
                     exist = jobAppArr.some( phoneExist => {
                        return (phoneExist === c.applicant[0].phone)
                     } );

                     if (!exist) jobAppArr.push(c.applicant[0].phone);
                  }
                  exist = false;

                  jobAppArr.push(c.company);

                  var obj = {
                        //  completed: 'false',
                         noficationSent: 'true',
                         _id: c._id
                        }

                  Application.updateApp(c._id, obj, (err, allApplications) => {
                     console.log('allApplications', allApplications);
                  });
               }
               console.log('jobAppArr: ', jobAppArr);
            })
         }
         // Send Email or twilio SMS jobAppArr
         // SendGrid.sendGridNotification(jobAppArr);

         Twilio.twilioNofication(jobAppArr);

      });
   }, true, true, 'America/Los_Angeles');
}

// module.exports = dailyBaseCronJobNotification;
