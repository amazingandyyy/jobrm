"use strict";

const CronJob = require('cron').CronJob;
const Application = require('../models/application');

// const cronNotificationJob = {
/*
   Runs everyday 11:30: AM Monday through Sunday
*/
// new CronJob('00 30 11 * * 0-6', () => {
   var cronNotificationJob = new CronJob('* * * * * *', () => {
      // console.log('You will see this message every second', Date());

      let jobApp = { };
      Application.getLastSevenDaysAll((err, allApplications) => {

         jobApp = allApplications;

         console.log('jobApp: ', jobApp);
         // console.log('allApplications: ', typeof allApplications);
         // console.log("jobApp[0].feedbackDate: ", jobApp[0].feedbackDate);
         // console.log("jobApp[0].applicant: ", jobApp[0].applicant);
         // console.log("jobApp[0].applicant[0].email: ", jobApp[0].applicant[0].email);
       });
   }, true, true, 'America/Los_Angeles');
// };

var ace;
module.exports = ace;
