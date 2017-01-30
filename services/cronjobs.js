const   CronJob = require('cron').CronJob,
        mailService = require('./mailService');

module.exports.runJobs = function() {
    
    new CronJob({
        /**
         * Runs every day
         * at 08:00:00 AM.
         */
        cronTime: '00 04 04 * * *',
        onTick: function() {

            mailService.sendForgotPassword({
                firstName: 'Isaac',
                lastName: 'Peraza',
                username : 'isaac.peraza@gmail.com'
            }, '1234567890');
        },
        start: true,
        timeZone: 'UTC'
    });
};
