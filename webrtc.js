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

