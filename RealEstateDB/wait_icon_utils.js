/**
 * A Jquery wait icon utils
 * 
 * Step:
 * 1) Add into below DIV to the html page
        <div id="overlay">
          <div class="cv-spinner">
            <span class="spinner"></span>
          </div>
        </div>
 * 2) At the ajax done, error, put in cancelWaitIcon()
 */


  function initWaitIcon(){
      jQuery(function($){
          $(document).ajaxSend(function() {
          // console.log('in ajaxSend');
          $("#overlay").fadeIn(300);　
        });
      });
  }

  
  function cancelWaitIcon(){
    $("#overlay").fadeOut(300);
  }
