const excel = require('node-excel-export');

//Styles for excel report
const styles = {
  header: {
    font: {
      color: {
        rgb: '000'
      },
      sz: 12,
      bold: false,
      underline: false
    }
  }
};

module.exports = {
  generateGifts : function (giftsDataSet){
    //Here you specify the export structure
    var specification = {
      giftNumber: {
        displayName: 'Gift Number',
        headerStyle: styles.header,
        cellFormat: function(value, row) {
          return '' + value;
        },
        width: 120
      },
      date: {
        displayName: 'Date',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      giftDescription: {
        displayName: 'Gift description',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      giftAmount: {
        displayName: 'Gift Amount',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      giftCode: {
        displayName: 'Gift Code',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      redeemCode: {
        displayName: 'Redeem Code',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      passCode: {
        displayName: 'Pass Code',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      senderFirstName: {
        displayName: 'Sender FirstName',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      senderLastName: {
        displayName: 'Sender LastName',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      giftMessage: {
        displayName: 'Gift Message',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      status: {
        displayName: 'Status',
        headerStyle: styles.header,
        cellFormat: function(value, row) {
          if (value.paid) {
            return 'Paid';
          }else if(value.declined){
            return 'Declined';
          }else if(value.redeemed){
            return 'Redeemed';
          }else if(value.accepted){
            return 'Accepted';
          }else {
            return 'Review';
          }
        },
        width: 120
      }
    };
    
    //create the excel report
    var report = excel.buildExport([
      {
        //name: 'Sheet name', // (optional)
        //heading: heading, // (optional)
        specification: specification,
        data: giftsDataSet
      }
    ]);
    
    return report;
  },
  generateUsers : function (usersDataSet){
    
    var specification = {
      firstName: {
        displayName: 'First Name',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      lastName: {
        displayName: 'Last Name',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      aliasFirstName: {
        displayName: 'Alias First Name',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      aliasLastName: {
        displayName: 'Alias Last Name',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      username: {
        displayName: 'Username',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      lastLoginDate: {
        displayName: 'Last Login Date',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      preferredPaymentMethod: {
        displayName: 'Preferred Payment Method',
        headerStyle: styles.header,
        cellStyle: styles.header,
        width: 120
      },
      isAdmin: {
        displayName: 'Admin',
        headerStyle: styles.header,
        cellFormat: function(value, row){
          return (value) ? 'Admin' : 'Non admin';
        },
        width: 120
      }
    };
    
    //create the excel report
    var report = excel.buildExport([
      {
        //name: 'Sheet name', // (optional)
        //heading: heading, // (optional)
        specification: specification,
        data: usersDataSet
      }
    ]);
    
    return report;
  },
};