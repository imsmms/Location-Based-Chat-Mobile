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