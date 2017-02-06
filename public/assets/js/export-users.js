/**
 * Created by imcodingideas on 2/5/17.
 */
function exportToExcel() {
  console.log('export clicked');
  //Export to excel
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/admin/users/excel-report', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    if (this.status === 200) {
      var filename = '';
      var disposition = xhr.getResponseHeader('Content-Disposition');
      if (disposition && disposition.indexOf('attachment') !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1])
          filename = matches[1].replace(/['"]/g, '');
      }
      var type = xhr.getResponseHeader('Content-Type');
      
      var blob = new Blob([this.response], { type: type });
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
      } else {
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);
        
        if (filename) {
          // use HTML5 a[download] attribute to specify filename
          var a = document.createElement('a');
          // safari doesn't support this yet
          if (typeof a.download === 'undefined') {
            window.location = downloadUrl;
          } else {
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
          }
        } else {
          window.location = downloadUrl;
        }
        
        setTimeout(
          function() {
            URL.revokeObjectURL(downloadUrl);
          },
          100
        ); // cleanup
      }
    } else {
      alert('Error, contact support');
    }
  };
  
  var finalUsers = users.filter(function(user) {
    if (user.select) {
      return user;
    }
  });
  
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ users: finalUsers }));
}