/**
 * chat.js is the controller that responsible for all the logic related to chat
 */

var messageLog = [];
var socket;
var receiver_id;

function Inizialize(receiver){
	var url = BASE_URL;
	socket = io.connect(BASE_URL);
	//socket.emit('chat', {id: '5295d752192e68720f000005'});
	socket.on('message', function(data) {
		appendMessageToLog(data.message, data.sender);
	});
}

function sendMessage(message){
	if(message == '')
		return;
	socket.emit('message', {to:'01008993983', txt:'Hello User'});
	appendMessageToLog(message, 0);
}

function appendMessageToLog(message, sender) {
	//messageLog.add({ Message: message, Sender: sender });
}

function displayChatBubbles(message,isSender){
	var appendedHTML = "";
	if(isSender){
		appendedHTML = "<p class=\"triangle-border right\">"+message+"<\/p>";
		//alert(appendedHTML);
	}else{
		appendedHTML = "<p class=\"triangle-border left\">"+message+"<\/p>";
	}
	$("#chatarea").append(appendedHTML);
}

$(document).keypress(function(e) {
	if(e.which == 13) {
		var message = $("#chatinput").val();
		displayChatBubbles(message,true);
		sendMessage(message);
	}
});

$("#chatarea").height($(window).height());
