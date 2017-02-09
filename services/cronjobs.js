const
  CronJob = require('cron').CronJob,
  moment = require('moment'),
  User = require('../models/user'),
  Gift = require('../models/gift'),
  locus = require('locus'),
  mailService = require('./email');


module.exports.runJobs = function() {
  
  /**
   * giftStatusIsReview
   */
  new CronJob({
    cronTime: '00 00 21 * * *',
    // cronTime: '* * * * * *',
    onTick: function() {
      
      // 2017-02-09T16:00:00   2017-02-09T00:00:00
      let startOfDay = (new moment()).startOf('day').format('YYYY-MM-DD')+'T00:00:00.000Z';
      //console.log(startOfDay);
      Gift
        .find({'status.review': true, changedStatusDate: {$gte: startOfDay}})
        .populate('user')
        .then(gifts => {
          gifts.forEach((gift) => {
            mailService.giftStatusIsReview(gift.user, gift);
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
    cronTime: '00 30 21 * * *',
    onTick: function() {
  
      let startOfDay = (new moment()).startOf('day').format('YYYY-MM-DD')+'T00:00:00.000Z';
      
      Gift.find({'status.paid': true, changedStatusDate: {$gte: startOfDay}})
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
