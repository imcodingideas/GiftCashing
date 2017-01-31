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
    cronTime: '00 28 08 * * *',
    onTick: function() {

      Gift
        .find({'status.review':true})
        .populate('user')
        .exec((err, gifts) => {
          gifts.forEach((gift) => {
            eval(locus);
            mailService.giftStatusIsReview(gift);
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
    cronTime: '00 00 08 * * *',
    onTick: function() {
      
      let start = new Date();
      start.setHours(0,0,0,0);
  
      let end = new Date();
      end.setHours(23,59,59,999);
      Gift
        .find({'status.paid':true, changedStatusDate : {$gte : start, $lte : end}})
        .populate('user')
        .exec((err, gifts) => {
          gifts.forEach((gift) => {
            mailService.giftStatusIsPaid(gift);
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
      
      // TODO: Repleace this with query data set fo giftStatusIsReviewOverSevenDays
      
      // users.forEach(function(user) {
      //   mailService.giftStatusIsReviewOverSevenDays(user);
      // })
    },
    start: true
    // timeZone: 'UTC'
  });
};
