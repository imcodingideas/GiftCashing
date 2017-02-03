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
    /**
     * Runs every day
     * at 11:57:00 PM.
     */
    cronTime: '00 11 11 * * *',
    onTick: function() {
      
      Gift
        .find({'status.review': true})
        .populate('user')
        .exec((err, gifts) => {
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
    /**
     * Runs every day
     * at 11:59:00 PM.
     */
    cronTime: '00 30 11 * * *',
    onTick: function() {
      
      Gift
        .find({'status.paid': true})
        .populate('user')
        .exec((err, gifts) => {
          gifts.forEach((gift) => {
            mailService.giftStatusIsPaid(gift.user);
          });
        });
    },
    start: true,
    // timeZone: 'UTC'
  });
  
  
  /**
   * giftStatusIsReviewOverSevenDays
   */
  new CronJob({
    /**
     * Runs every day
     * at 11:59:00 PM.
     */
    cronTime: '00 00 08 * * *',
    onTick: function() {
    
      let days = 7;
      let date = new Date();
      let last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    
      Gift
        .find({'status.review': true, changedStatusDate: {$lte: last}})
        .populate('user')
        .exec((err, gifts) => {
          gifts.forEach((gift) => {
            mailService.giftStatusIsReviewOverSevenDays(gift.user);
          });
        });
    },
    start: true
    // timeZone: 'UTC'
  });
};
