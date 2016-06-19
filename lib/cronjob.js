"use strict";

const CronJob = require('cron').CronJob;
const Application = require('../models/application');
const SendGrid = require('../lib/sendgrid');

exports.dailyBaseCronJobVerify = () => {

   new CronJob('* * * * * *', () => {
   // new CronJob('00 30 11 * * 0-6', () => {

      let jobApp = {};
      let jobAppArr = [];
      Application.getLastSevenDaysAll((err, jobApp) => {

         // jobApp = allApplications;

         if (jobApp.length) {
            jobApp.forEach( function(c) {

               if (c.applicant[0] != 'undefind' || c.applicant[0] != null != c.applicant[0] != '') {
                  let exist = false;
                  exist = jobAppArr.some( emailExist => {
                     return (emailExist === c.applicant[0].email)
                  } );

                  if (!exist) jobAppArr.push(c.applicant[0].email);
                  exist = false;

                  jobAppArr.push(c.company);

                  var obj = {
                         completed: 'false',
                         noficationSent: 'true',
                         _id: c._id
                        }

                  Application.noficationSentUpdate(c._id, obj, (err, allApplications) => {
                     // console.log('allApplications', allApplications);
                  });

               }
            })
         }

         // Send Email or twilio SMS jobAppArr
         SendGrid.sendGridVerify(jobAppArr);

      });
   }, true, true, 'America/Los_Angeles');
}
