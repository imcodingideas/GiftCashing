const CronJob = require('cron').CronJob

const moment = require('moment')

const locus = require('locus')
const User = require('../models/user')

const Gift = require('../models/gift')

const mailService = require('./email')

module.exports.runJobs = function() {
  /**
   * giftStatusIsReview
   */
  new CronJob({
    cronTime: '00 00 21 * * *',
    // cronTime: '* * * * * *',
    onTick() {
      // 2017-02-09T16:00:00   2017-02-09T00:00:00
      const startOfDay = `${new moment()
        .startOf('day')
        .format('YYYY-MM-DD')}T00:00:00.000Z`
      Gift.find({ 'status.review': true })
        .populate('user')
        .then(gifts => {
          gifts.forEach(gift => {
            mailService.giftStatusIsReview(gift.user, gift)
          })
        })
    },
    start: true,
    // timeZone: 'UTC'
  })

  /**
   * giftStatusIsPaid
   */
  new CronJob({
    cronTime: '00 30 21 * * *',
    // cronTime: '* * * * * *',
    onTick() {
      const startOfDay = `${new moment()
        .startOf('day')
        .format('YYYY-MM-DD')}T00:00:00.000Z`

      Gift.find({
        'status.paid': true,
        changedStatusDate: { $gte: startOfDay },
      })
        .populate('user')
        .then(gifts => {
          gifts.forEach(gift => {
            mailService.giftStatusIsPaid(gift.user)
          })
        })
    },
    start: true,
    // timeZone: 'UTC'
  })
}
