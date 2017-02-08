const
  CronJob = require('cron').CronJob,
  User = require('../models/user'),
  Gift = require('../models/gift'),
  locus = require('locus'),
  mailService = require('./email');


module.exports.runJobs = function() {
  
  /**
   * giftStatusIsReview
   */
  new CronJob({
    cronTime: '00 55 23 * * *',
    // cronTime: '00 39 13 * * *',
    onTick: function() {
  
      let days = 1;
      let date = new Date();
      let last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
      
      Gift
        .find({'status.review': true, changedStatusDate: {$gte: last}})
        .populate('user')
        .then(gifts => {
          gifts.forEach((gift) => {
            mailService.giftStatusIsReview(gift.user);
          });
        });
    },
    start: true
    // timeZone: 'UTC'
  });
  
  
  /**
   * giftStatusIsPaid
   */
  new CronJob({
    cronTime: '00 58 23 * * *',
    // cronTime: '00 9 14 * * *',
    onTick: function() {
  
      let days = 1;
      let date = new Date();
      let last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
  
      Gift.find({'status.paid': true, changedStatusDate: {$gte: last}})
          .populate('user')
          .then(gifts => {
            gifts.forEach((gift) => {
              mailService.giftStatusIsPaid(gift.user);
            });
          })
    },
    start: true,
    // timeZone: 'UTC'
  });
  
};
