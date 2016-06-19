"use strict";

const CronJob = require('cron').CronJob;
const Application = require('../models/application');

exports.dailyBaseCronJobVerify = () => {

   new CronJob('* * * * * *', () => {
      // console.log('You will see this message every second', Date());
      // new CronJob('00 30 11 * * 0-6', () => {

      let jobApp = {};
      let jobAppArr = [];
      Application.getLastSevenDaysAll((err, allApplications) => {

         jobApp = allApplications;

         if (jobApp.length) {
            jobApp.forEach( function(c) {
               if (c.applicant[0] != 'undefind'  || c.applicant[0] != null != c.applicant[0] != '') {
                  let exist = false;
                  exist = jobAppArr.some( emailExist => {
                     return (emailExist === c.applicant[0].email)
                  } );

                  if (!exist) jobAppArr.push(c.applicant[0].email);
                  exist = false;

                  jobAppArr.push(c.company);
               }
            })
         }

         // Send Email or twilio SMS jobAppArr
         console.log('jobAppArr: ', jobAppArr);

      });
   }, true, true, 'America/Los_Angeles');
}

// var ace;
// module.exports = ace;
