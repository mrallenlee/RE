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
 * 3) Add initWaitIcon() at the html page script section
 * 4) Add below to the stylesheet.css
 
/* For wait_icon_utils.js to display waiting spinner */
/*
#overlay{	
	position: fixed;
	top: 0;
	z-index: 100;
	width: 100%;
	height:100%;
	display: none;
	background: rgba(0,0,0,0.6);
  }
  .cv-spinner {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;  
  }
  .spinner {
	width: 40px;
	height: 40px;
	border: 4px #ddd solid;
	border-top: 4px #2e93e6 solid;
	border-radius: 50%;
	animation: sp-anime 0.8s infinite linear;
  }
  @keyframes sp-anime {
	100% { 
	  transform: rotate(360deg); 
	}
  }
  .is-hide{
	display:none;
  }
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
