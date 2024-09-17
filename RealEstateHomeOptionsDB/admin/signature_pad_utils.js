// Utilities function for usage in Signature Pad
// Used by report_pdi_day30.phtml and report_pdi.phtml so far


// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
  
    // This part causes the canvas to be cleared
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
  
    // This library does not listen for canvas changes, so after the canvas is automatically
    // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
    // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
    // that the state of this library is consistent with visual state of the canvas, you
    // have to clear it manually.
    signaturePad.clear();
  }
  
  // On mobile devices it might make more sense to listen to orientation change,
  // rather than window resize events.
  //window.onresize = resizeCanvas;
  //resizeCanvas();
  
  function download(dataURL, filename) {
    // Disable the first option
    if (0 && navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
      // alert('first window.open');
      window.open(dataURL);
    } else {
      var blob = dataURLToBlob(dataURL);
      var url = window.URL.createObjectURL(blob);
  
      var a = document.createElement("a");
      a.style = "display: none";
      a.href = url;
      a.download = filename;
  
      document.body.appendChild(a);
      a.click();
  
      window.URL.revokeObjectURL(url);
    }
  }
  
  
  // Upload to server and store in DB
  function upload(dataURL, reportType, unitNumber) {
    $.ajax({
            type: "POST",
            url: "report_pdi_upload.phtml",
            data: { 
              imgBase64: dataURL,
              unitNumber: unitNumber,
              reportType: reportType
            }
          }).done(function(o) {
            returnObj = JSON.parse(o)
            if (returnObj.status == 'SUCCESS')
              alert('Upload successfully');
            else
              alert("Upload failed - Error Message = " + o);
            // alert('Upload successfully' + o);
          })
          .fail(function(xhr, status, error) {
            //Ajax request failed.
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
          })
  
    } // ajax
  
  
  function uploadAndEmail(dataURL, reportType, unitNumber){
    // same code as upload.
    // ALLEN TO DO find way to insert code to upload to avoid redundancy
    $.ajax({
            type: "POST",
            url: "report_pdi_upload.phtml",
            data: { 
              imgBase64: dataURL,
              unitNumber: unitNumber,
              reportType: reportType
            }
          }).done(function(o) {
            returnObj = JSON.parse(o)
            if (returnObj.status == 'SUCCESS')
              // Email the signed copy to email based on the record on purchaser
              emailPDISignedReportToPurchaser(unitNumber, reportType);          
              // alert('Upload successfully');
            else
              alert("Upload failed - Error Message = " + o);
            // alert('Upload successfully' + o);
          })
          .fail(function(xhr, status, error) {
            //Ajax request failed.
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
          })  
  } // uploadAndEmail
  
    // Email from server to purchaser on the server sided contract
    function emailPDISignedReportToPurchaser(unitNumber, reportType) {
      $.ajax({
            type: "POST",
            url: "report_pdi_email.phtml",
            data: { 
              unitNumber: unitNumber,
              reportType: reportType
            }
          }).done(function(o) {
              // Email the signed copy to email based on the record on purchaser
            //  alert('message=' + o);
            returnObj = JSON.parse(o)
            if (returnObj.status == 'SUCCESS')
              alert(returnObj.message);
            else
              alert("Email failed - Error Message = " + o);
            // alert('Upload successfully' + o);          
          })
          .fail(function(xhr, status, error) {
            //Ajax request failed.
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
          })
  
    } // emailPDISignedReportToPurchaser 
  
  // One could simply use Canvas#toBlob method instead, but it's just to show
  // that it can be done using result of SignaturePad#toDataURL.
  function dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    var parts = dataURL.split(';base64,');
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
  
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
  
    return new Blob([uInt8Array], { type: contentType });
  }