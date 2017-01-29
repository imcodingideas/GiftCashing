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
		  giftNumber: { // <- the key should match the actual data key 
		    displayName: 'Gift Number', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellStyle: styles.header,
		    width: 120 // <- width in pixels 
		  },		  
		  date: { // <- the key should match the actual data key 
		    displayName: 'Date', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellStyle: styles.header,
		    width: 120 // <- width in pixels 
		  },
		  giftDescription: { // <- the key should match the actual data key 
		    displayName: 'Gift description', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellStyle: styles.header,
		    width: 120 // <- width in pixels 
		  },
		  giftAmount: { // <- the key should match the actual data key 
		    displayName: 'Gift Amount', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellStyle: styles.header,
		    width: 120 // <- width in pixels 
		  },
		  giftCode: { // <- the key should match the actual data key 
		    displayName: 'Gift Code', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellStyle: styles.header,
		    width: 120 // <- width in pixels 
		  },
		  redeemCode: { // <- the key should match the actual data key 
		    displayName: 'Redeem Code', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellStyle: styles.header,
		    width: 120 // <- width in pixels 
		  },
		  passCode: { // <- the key should match the actual data key 
		    displayName: 'Pass Code', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellStyle: styles.header,
		    width: 120 // <- width in pixels 
		  },
		  senderFirstName: { // <- the key should match the actual data key 
		    displayName: 'Sender FirstName', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellStyle: styles.header,
		    width: 120 // <- width in pixels 
		  },
		  senderLastName: { // <- the key should match the actual data key 
		    displayName: 'Sender LastName', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellStyle: styles.header,
		    width: 120 // <- width in pixels 
		  },
		  giftMessage: { // <- the key should match the actual data key 
		    displayName: 'Gift Message', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellStyle: styles.header,
		    width: 120 // <- width in pixels 
		  },
		  status: { // <- the key should match the actual data key 
		    displayName: 'Status', // <- Here you specify the column header 
		    headerStyle: styles.header, // <- Header style 
		    cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property 
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
		    width: 120 // <- width in pixels 
		  }
		};

		//create the excel report
		var report = excel.buildExport([
		    {
		      //name: 'Sheet name', // <- Specify sheet name (optional) 
		      //heading: heading, // <- Raw heading array (optional) 
		      specification: specification, // <- Report specification 
		      data: giftsDataSet // <-- Report data 
		    }
		  ]);

		return report;
	}
};