const excel = require('node-excel-export')

// Styles for excel report
const styles = {
  header: {
    font: {
      color: {
        rgb: '000',
      },
      sz: 12,
      bold: false,
      underline: false,
    },
  },
}

module.exports = {
  generateGifts(giftsDataSet) {
    // Here you specify the export structure
    const specification = {
      giftNumber: {
        displayName: 'Gift Number',
        headerStyle: styles.header,
        cellFormat(value, row) {
          return `${value}`
        },
        width: 120,
      },
      date: {
        displayName: 'Date',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      giftDescription: {
        displayName: 'Gift description',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      giftAmount: {
        displayName: 'Gift Amount',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      giftCode: {
        displayName: 'Gift Code',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      redeemCode: {
        displayName: 'Redeem Code',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      passCode: {
        displayName: 'Pass Code',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      senderFirstName: {
        displayName: 'Sender FirstName',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      senderLastName: {
        displayName: 'Sender LastName',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      giftMessage: {
        displayName: 'Gift Message',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      status: {
        displayName: 'Status',
        headerStyle: styles.header,
        cellFormat(value, row) {
          if (value.paid) {
            return 'Paid'
          }
          if (value.declined) {
            return 'Declined'
          }
          if (value.redeemed) {
            return 'Redeemed'
          }
          if (value.accepted) {
            return 'Accepted'
          }
          return 'Review'
        },
        width: 120,
      },
    }

    // create the excel report
    const report = excel.buildExport([
      {
        // name: 'Sheet name', // (optional)
        // heading: heading, // (optional)
        specification,
        data: giftsDataSet,
      },
    ])

    return report
  },
  generateUsers(usersDataSet) {
    const specification = {
      firstName: {
        displayName: 'First Name',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      lastName: {
        displayName: 'Last Name',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      aliasFullName: {
        displayName: 'Alias Full Name',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      username: {
        displayName: 'Username',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      lastLoginDate: {
        displayName: 'Last Login Date',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      preferredPaymentMethod: {
        displayName: 'Preferred Payment Method',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120,
      },
      isAdmin: {
        displayName: 'Admin',
        headerStyle: styles.header,
        cellFormat(value, row) {
          return value ? 'Admin' : 'Non admin'
        },
        width: 120,
      },
    }

    // create the excel report
    const report = excel.buildExport([
      {
        // name: 'Sheet name', // (optional)
        // heading: heading, // (optional)
        specification,
        data: usersDataSet,
      },
    ])

    return report
  },
}
