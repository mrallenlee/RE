/*
Simple Image Trail script- By JavaScriptKit.com
Visit http://www.javascriptkit.com for this script and more
This notice must stay intact
*/

var offsetfrommouse=[15,15]; //image x,y offsets from cursor position in pixels. Enter 0,0 for no offset
var displayduration=0; //duration in seconds image should remain visible. 0 for always.
var currentHeight = 270;	// maximum image size.
var STATUS_BAR_HEIGHT = 50;

if (document.getElementById || document.all){
	document.write('<div style="z-index:9" id="floatingDIV1">');
	document.write('</div>');
	document.write('<div style="z-index:9" id="floatingDIV2">');
	document.write('</div>');
	document.write('<div style="z-index:9" id="floatingDIV3">');
	document.write('</div>');
}

function getFloatingDiv(index){
	if (document.getElementById)
	return document.getElementById("floatingDIV" + index).style
	else if (document.all)
	return document.all.fullNoteDIV.style
}

function getFloatingDivNoStyle(index){
if (document.getElementById)
return document.getElementById("floatingDIV" + index)
else if (document.all)
return document.all.fullNoteDIV
}

function truebody(){
return (!window.opera && document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}

function urldecode(str){
    str=str.replace(new RegExp('\\+','g'),' ')
    return unescape(str)
}

function nl2br(str){
    str=str.replace(new RegExp('\n+','g'),'<BR>')
    return str
}

// width of description width
// height of description areao
// outer width and height will be width + 150
function showNote(index, title,description,descriptionWidth,descriptionHeight, divWidth, divHeight, cssClass){

	var showthumb = 0;
	if (divHeight > 0){
		currentHeight = divHeight;
	}

	if (cssClass == undefined){
		cssClass = 'popupDiv'
	}
		
	description = urldecode(description);
	description = nl2br(description);

	document.onmousemove=followmouse;

	cameraHTML = '';

	newHTML = '<DIV ALIGN="LEFT" class="' + cssClass + '">';
	newHTML += '<span class="largetitle">' + title + '</span>';
	newHTML += '<BR><BR><SPAN HEIGHT="' + descriptionHeight + '" WIDTH="' + descriptionWidth + '" class="blank">' + description + '</SPAN><br/>';
	

	if (showthumb > 0){
		newHTML += '<div align="center" style="padding: 8px 2px 2px 2px;"><img src="' + imagename + '" border="0"></div>';
	}

	newHTML += '</DIV>';

	getFloatingDivNoStyle(index).innerHTML = newHTML;


	getFloatingDiv(index).visibility="visible";
	getFloatingDiv(index).width= divWidth + 'px';	
	getFloatingDiv(index).height= divHeight + 'px';	
	getFloatingDiv(index).position="absolute";
}

function hideFloatingDiv(index){
	getFloatingDiv(index).visibility="hidden"
	document.onmousemove=""
	getFloatingDiv(index).left="-500px"

}

/**
* Display close button which horizontal align is right
*/
function getCloseButton(index){
	return ' <DIV ALIGN="RIGHT"><INPUT TYPE="BUTTON" onClick="hideFloatingDiv(' + index + ');" VALUE="Close"></DIV> ';
}

/**
* Get number value from a string mix with alphabet. 
* Currently only work for 120px, which the number be returned is 120
*/
function getNumber(input){
	return input.substring(0, input.length-2);
}

/**
* Center the DIV
* divObj: real div object
*/
function centerDIV(divObj){
	var styleObj = divObj.style;
//	var docWidth=document.all? truebody().scrollLeft+truebody().clientWidth : pageXOffset+window.innerWidth-15
	var docWidth=document.all? Math.min(truebody().scrollWidth, truebody().clientWidth) : window.innerWidth
//	var docHeight=document.all? Math.min(truebody().scrollHeight, truebody().clientHeight) : Math.min(document.body.offsetHeight, window.innerHeight)
	var docHeight=document.all? Math.min(truebody().scrollHeight, truebody().clientHeight) : window.innerHeight
	var divWidth = getNumber(styleObj.width);
	var divHeight = getNumber(styleObj.height);
	var x=(docWidth - divWidth) /2;
	var y=(docHeight - divHeight) /2;
	y = y + truebody().scrollTop;
	x = x + truebody().scrollLeft;
//alert('x=' + x + ' y=' + y);
	styleObj.left=x+"px"
	styleObj.top=y+"px"
}

// always use the 1 as the div layer
function followmouse(e){

	var xcoord=offsetfrommouse[0]
	var ycoord=offsetfrommouse[1]
	
	var divWidth = getNumber(getFloatingDiv(1).width)
	var divHeight = getNumber(getFloatingDiv(1).height)

	var docwidth=document.all? truebody().scrollLeft+truebody().clientWidth : pageXOffset+window.innerWidth-15
//	var docheight=document.all? Math.min(truebody().scrollHeight, truebody().clientHeight) : Math.min(document.body.offsetHeight, window.innerHeight)
	// works for IE, FF. Not sure the otherss
	var docheight=Math.min(truebody().scrollHeight, truebody().clientHeight)
	if (typeof e != "undefined"){
		// firefox
		if (docwidth - e.pageX < divWidth){
			xcoord = e.pageX - xcoord - divWidth; // Move to the left side of the cursor
		} else {
			xcoord += e.pageX;
		}
//alert('docHeidht=' + docheight	+ ' y=' + e.pageY + ' truebody().scrollTop=' + truebody().scrollTop)	
		if (docheight - (e.pageY - truebody().scrollTop)  < Number(divHeight)){
		
//alert('value=' + (Number(divHeight) + e.pageY - docheight - truebody().scrollTop))		
//			ycoord = e.pageY - (Number(divHeight) + e.pageY - docheight - truebody().scrollTop - 50);
//			ycoord = e.pageY - Math.max(0,(Number(divHeight) + e.pageY - docheight - truebody().scrollTop - 50));
			ycoord = e.pageY + truebody().scrollTop - Math.max(0,(Number(divHeight) + e.pageY - docheight)) - STATUS_BAR_HEIGHT;
			
		} else {
			ycoord += e.pageY;
		}
	} else if (typeof window.event != "undefined"){
		// IE
		if (docwidth - event.clientX < divWidth){
			xcoord = event.clientX + truebody().scrollLeft - xcoord - divWidth; // Move to the left side of the cursor
		} else {
			xcoord += truebody().scrollLeft+event.clientX
		}
		if (docheight - event.clientY < (divHeight)){
			ycoord = event.clientY + truebody().scrollTop - Math.max(0,(Number(divHeight) + event.clientY - docheight)) - STATUS_BAR_HEIGHT;
		} else {
			ycoord += truebody().scrollTop + event.clientY;
		}
	}

	var docwidth=document.all? truebody().scrollLeft+truebody().clientWidth : pageXOffset+window.innerWidth-15
	var docheight=document.all? Math.max(truebody().scrollHeight, truebody().clientHeight) : Math.max(document.body.offsetHeight, window.innerHeight)

	getFloatingDiv(1).left=xcoord+"px"
	getFloatingDiv(1).top=ycoord+"px"

}

