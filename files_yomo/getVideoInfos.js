var init = function (){
	
	if (document.getElementsByTagName("video")[0]!=null && document.getElementsByClassName("ytp-iv-video-content").length != 0){

		player = document.getElementsByTagName("video")[0];

		addOutDivs();

		last_infos = "";
		last_videoHeight = -1;
		last_volume = -1;
		last_duration = 0;
		last_ytid = "";
		last_title = "";	
		
		addEventListeners();
		//setWide();
		run();
	} else {
		setTimeout(init, 100);
	};
};


function showError()
{
    document.getElementById("divLog").innerHTML += "error";
   	return true
}

function addOutDivs(){
	var divOutC = document.createElement("div");
	divOutC.id = "outC";
	body = document.getElementsByTagName("body")[0];
	body.appendChild(divOutC);
	var divOutE = document.createElement("div");
	divOutE.id = "outE";
	body.appendChild(divOutE);
	var divLog = document.createElement("div");
	divLog.id = "divLog";
	document.getElementsByTagName("body")[0].appendChild(divLog);
	//window.onerror = showError();
}

var setWide = function (){
	//divLog.innerHTML += new Date().getTime() + " " + window.getComputedStyle(document.getElementsByClassName("ytp-iv-video-content")[0]).getPropertyValue('width') + " \n";
	if (window.getComputedStyle(document.getElementsByClassName("ytp-iv-video-content")[0]).getPropertyValue('width').replace('px','') < 2000) {
		document.getElementsByClassName("ytp-size-button")[0].click();
		divLog.innerHTML += new Date().getTime() + " " + window.getComputedStyle(document.getElementsByClassName("ytp-iv-video-content")[0]).getPropertyValue('width') + " \n";
	}
	setTimeout(setWide, 100);
};


var run = function (){
	try {
		//divLog.innerHTML += new Date().getTime() + " " + window.getComputedStyle(document.getElementsByClassName("ytp-iv-video-content")[0]).getPropertyValue('width') + " \n";
		getInfos();
		var currentTime = player.currentTime;
		var i = player.buffered.length;
		var availablePlaybackTime = player.buffered.end(i-1);
		var bufferedTime = availablePlaybackTime - currentTime;
		outC = outC + new Date().getTime() + "#" +  currentTime + "#" + bufferedTime + "#" + availablePlaybackTime +"\n";
		//outE = outE + "here \n";
		document.getElementById("outC").innerHTML = outC;
		document.getElementById("outE").innerHTML = outE;
	}
	catch(err) {
		document.getElementById("divLog").innerHTML += err.message;
	}	
	setTimeout(run, 1000);
};

function getInfos(){
	var currentTime = new Date().getTime();
    
	var videoHeight = player.videoHeight;
	if(last_videoHeight != videoHeight){
		last_videoHeight = videoHeight;
		var videoWidth = player.videoWidth;
		var infos = "quality:"+ videoHeight + "p" + " (" + videoWidth + "x" + videoHeight + ")";
		outE = outE + currentTime + "#" + infos + "\n";
	}

	var volume = player.volume;
	if(last_volume != volume){
		last_volume = volume;
		var infos = "volume:"+ volume + "";
		outE = outE + currentTime + "#" + infos + "\n";
	}

	var duration = player.duration;
	if(last_duration != duration){
		last_duration = duration;
		var infos = "duration:"+ duration + "";
		outE = outE + currentTime + "#" + infos + "\n";
	}

	var ytid = getYouTubeID();
	if(last_ytid != ytid){
		last_ytid = ytid;
		var infos = "ytid:"+ ytid + "";
		outE = outE + currentTime + "#" + infos + "\n";
	}

	var title = getTitle();
	if(last_title != title){
		last_title = title;
		var infos = "title:"+ title + "";
		outE = outE + currentTime + "#" + infos + "\n";
	}        
};

function getTitle() {
	if (document.getElementById("eow-title")) {
            return document.getElementById("eow-title").getAttribute("title");
    } else {
        if (document.getElementById("watch-headline-title")) {
            return document.getElementById("watch-headline-title").getElementsByTagName("span")[0].getAttribute("title");
        } else {
            return "undefined";
        }
    }
};

function getYouTubeID() {
	var video_id = window.location.search.split("v=")[1];
	var ampersandPosition = video_id.indexOf("&");
	if(ampersandPosition != -1) {
	  video_id = video_id.substring(0, ampersandPosition);
	}
	return video_id;
};

function addEventListeners(){

	player.addEventListener("loadstart", function() 
	{
	  var event = "loadstart";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos + "\n";
	});

	player.addEventListener("canplay", function() 
	{
	  var event = "canplay";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos + "\n";
	});

	player.addEventListener("playing", function() 
	{
	  var event = "playing";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos + "\n";
	});

	player.addEventListener("play", function() 
	{
	  var event = "play";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos + "\n";
	});

	player.addEventListener("pause", function() 
	{
	  var event = "pause";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos +  "\n";
	});

	player.addEventListener("ended", function()
	{
	  var event = "ended";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos + "\n";
	});

	player.addEventListener("stalled", function() 
	{
	  var event = "stalled";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos + "\n";
	});

	player.addEventListener("waiting", function() 
	{
	  var event = "waiting";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos + "\n";
	});

	player.addEventListener("abort", function() 
	{
	  var event = "abort";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos + "\n";
	});

	player.addEventListener("emptied", function() 
	{
	  var event = "emptied";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos + "\n";
	});

	player.addEventListener("error", function() 
	{
	  var event = "error";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos + "\n";
	});

	player.addEventListener("suspend", function() 
	{
	  var event = "suspend";
	  var infos = event;
	  var currentTime = new Date().getTime();
	  outE = outE + currentTime + "#" + infos +  "\n";
	});
}


var outE = "";
var outC = "";

var player = null;
var last_infos = "";
var last_videoHeight = -1;
var last_volume = -1;
var last_duration = 0;
var last_ytid = "";
var last_title = "";

var divLog = document.createElement("div");
divLog.id = "divLog";
document.getElementsByTagName("body")[0].appendChild(divLog);
divLog.innerHTML += new Date().getTime() + " Starting \n";

init();



