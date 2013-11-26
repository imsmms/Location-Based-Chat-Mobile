var messageLog = [];
var socket;
var receiver_id;

function Inizialize(receiver){
	var url = BASE_URL + CHAT_API;
	socket = io.connect(BASE_URL + ':3000');
	socket.on('message', function(data) {
		appendMessageToLog(data.message, data.sender);
	});
}

function sendMessage(message){
	if(message == '')
		return;
	socket.emit('message', { Message: message, Receiver: receiver_id });
	appendMessageToLog(message, 0);
}

function appendMessageToLog(message, sender) {
	messageLog.add({ Message: message, Sender: sender });
}