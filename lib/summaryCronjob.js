"use strict";

const CronJob = require('cron').CronJob;
const SendGrid = require('../lib/sendgrid');
const User = require('../models/user');
const moment = require('moment');

exports.dailyBaseCronJobNotification = () => {

   // new CronJob('* * * * * *', () => {
   new CronJob('00 30 11 * * 0-6', () => {

      User.getUsers( (err, users) => {

         if (users.length > 0) {

            let userObj = {};
            users.forEach( c => {

               userObj.userEmail = c.email;
               userObj.subject = 'Google Calendar summary';

               var description = '';
               c.googleCalendarData.events.map( c2 => {

                  let today = moment().startOf('day').format('YYYY-MM-DD');
                  let summaryDate = moment(today).add(7, 'days').format('YYYY-MM-DD');
                  if ((today <= c2.startDate)  &&  (c2.startDate <= summaryDate)) {
                     description += c2.description + ', ';
                  }
               });

               if ( userObj.message != '' ){
                  userObj.message = description;

                  // Send Email
                  SendGrid.sendGridNotification(userObj, function(err, retVal) {});
                  userObj = '';
               }
            });
         }
      });

   }, true, true, 'America/Los_Angeles');
}

// module.exports = dailyBaseCronJobNotification;
