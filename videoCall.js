var call_token;
var signaling_server;	//WebSocket API connection
var peer_connection;

//detects if you are caller or callee and then
//sets up necessary functionality
function start()
{
	peer_connection = new rtc_peer_connection (
	{
		"iceServers": [{"url":"stun:" + stun_server},]
	});

	peer_connection.onicecandidate = function (ice_event) 
	{
    	if (ice_event.candidate) 
    	{
      		signaling_server.send
      		(
        		JSON.stringify
        		({
          			type: "new_ice_candidate",
          			candidate: ice_event.candidate ,
        		})
      		);
    	}
  	};

	peer_connection.onaddstream = function (event) 
	{
    	connect_stream_to_src(event.stream, document.getElementById("remote_video"));
    	
    	//hide what is shown currently for video and show remote stream.
    	document.getElementById("loading_state").style.display = "none";
    	document.getElementById("open_call_state").style.display = "block";
  	};

	signaling_server = new WebSocket ("ws://10.111.96.206:1234");

	//determine if caller or calle if they have a hash fragemnt in URL.
	if (document.location.hash === "" || document.location.hash === undefined)
	{
		// create unique token 
	    var token = Date.now()+"-"+Math.round(Math.random()*10000);
	    call_token = "#"+token;
	    //call_token = "#" + (Date.now()+"-"+Math.round(Math.random()*10000));

	    // *** Should it be set to call_token instead ??? *** //
	    document.location.hash = token;

	    signaling_server.onopen = function() {
	      // setup caller signal handler
	      signaling_server.onmessage = caller_signal_handler;

	      // tell the signaling server you have joined the call 
	      signaling_server.send(
	        JSON.stringify({ 
	          token:call_token,
	          type:"join",
	        })
	      );

	      document.getElementById("loading_state").innerHTML = "Ready for a video-conference.Send the following link to the other participants.<br/><br/>" + document.location;		
	}
	else
	{
		//you are the callee
	    call_token = document.location.hash;

	    signaling_server.onopen = function() 
	    {
	      // setup caller signal handler
	      signaling_server.onmessage = callee_signal_handler;

	      signaling_server.send(
	      	JSON.stringify
	      	({ 
	        	token:call_token,
	          	type:"join",
	        })
	      );

	      signaling_server.send(
	        JSON.stringify
	        ({ 
	          	token:call_token,
	          	type:"callee_arrived",
	        })
	      );
	    }

	    document.getElementById("loading_state").innerHTML = "Please wait. Your call is being connected ...";
	  }
		}
};