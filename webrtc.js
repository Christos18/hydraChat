/********** GLOBAL VARIABLES FOR WEBRTC MAIN FEATURES ***************/
// global variables used to enhance interoperability. The values they get are 
// based on what browser implementation there is, i.e. mozWebRTC of webKitWebRTC.

var webrtc_capable = true;
var rtc_peer_connection = null;
var rtc_session_description = null;
var get_user_media = null;
var connect_stream_to_src = null;		/
var stun_server = "stun.l.google.com:19302";

/***********************************************/

if (navigator.getUserMedia)
{
	rtc_peer_connection = RTCPeerConnection;
    rtc_session_description = RTCSessionDescription;
	get_user_media = navigator.getUserMedia;
	connect_stream_to_src = function (media_stream, media_element)
	{
		media_element.srcObject = media_stream;
		media_element.play();
	};
}
else if (navigator.mozGetUserMedia)
{
	rtc_peer_connection = mozRTCPeerConnection;
    rtc_session_description = mozRTCSessionDescription;
	get_user_media = navigator.mozGetUserMedia;
	connect_stream_to_src = function (media_stream, media_element)
	{
		media_element.mozSrcObject = media_stream;
		media_element.play();
	};
}
else if (navigator.webkitGetUserMedia)
{
	rtc_peer_connection = webkitRTCPeerConnection;
    rtc_session_description = webkitRTCSessionDescription;
	get_user_media = navigator.webkitGetUserMedia;
	connect_stream_to_src = function (media_stream, media_element)
	{
		media_element.src = webkitURL.createObjectURL(media_stream);
	};
}
else
{
	alert("Your browser does not support WebRTC. Please use Chrome of Firefox.")
	webrtc_capable = false;
}