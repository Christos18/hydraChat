//########## packages needed ##########//
var http = require("http");
var fs = require ("fs");
var websocket = require("websocket").server;

//########## global variables ##########//
var port = 80;
var webrtc_clients = [];
var webrtc_discussions = {};

//########## Web Server Functions ##########//
var http_server = http.createServer(function(request, response)
	{
		response.write(page);
		response.end();
	});

http_server.listen(port, function()
	{
		log_comment("server listening (port " + port + ") ");
	});

var page = undefined;
fs.readFile("index.html", function(error, data)
	{
		if (error)
		{
			log_error(error);
		}
		else
		{
			page = data;
		}
	});

var websocket_server = new websocket ({httpServer: http_server});
websocket_server.on("request", function(request)
	{
		log_comment("new request (" + request.origin + ")");
	});

// TODO: Here are accept all requests for connection.
// 		 ADD some form of authentication.

var connection = request.accept(null, request.origin);
log_comment("new connection (" + connection.remoteAddress + ")");

webrtc_clients.push(connection);
connection.id = webrtc_clients.length-1;

//########## Signaling Functionality ##########//
connection.on("message", function(message) 
{
    if (message.type === "utf8") 
    {
      log_comment("got message "+message.utf8Data);

      var signal = undefined;
      try { signal = JSON.parse(message.utf8Data); } catch(e) { };
      if (signal) 
      {
        if (signal.type === "join" && signal.token !== undefined) 
        {
          try 
          {
            if (webrtc_discussions[signal.token] === undefined) 
            {
              webrtc_discussions[signal.token] = {};
            }
          } catch(e) { };
          try 
          {
            webrtc_discussions[signal.token][connection.id] = true;
          } catch(e) { };
        } else if (signal.token !== undefined) 
        {
          try 
          {
            Object.keys(webrtc_discussions[signal.token]).forEach(function(id) 
            {
              if (id != connection.id)
              {
                webrtc_clients[id].send(message.utf8Data, log_error);
              }
            });
          } catch(e) { };
        } else 
        {
          log_comment("invalid signal: "+message.utf8Data);
        }
      } else 
      {
        log_comment("invalid signal: "+message.utf8Data);
      }
    }
});
  
connection.on("close", function(connection) 
{
	log_comment("connection closed ("+connection.remoteAddress+")");    
    Object.keys(webrtc_discussions).forEach(function(token)
    {
    	Object.keys(webrtc_discussions[token]).forEach(function(id) 
    	{
        	if (id === connection.id)
        	{
          		delete webrtc_discussions[token][id];
        	}
      	});
    });
  //});
});

//########## Utility Functions ##########//
function log_error(error)
{
	if (error !== "Connection closed" && error !== undefined)
	{
		log_comment ("ERROR: " + error);
	}
};

function log_comment (comment)
{
	console.log((new Date()) + " " + comment);
};