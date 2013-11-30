var messageLog = [];
var socket;

function Inizialize(receiver){
	$("#friendName").html(phoneContactsArray[chatID].getContactName());
	var chatareaheight = parseInt($(window).height()) - 102;
	$("#chatarea").css("max-height",chatareaheight+"px");
	touchScroll('chatarea');
	
	var url = BASE_URL;
	socket = io.connect(BASE_URL);
	socket.emit('chat', {id: userId});
	socket.on('message', function(data) {
		if(data['from'] == null && data['from'] == '')
			return;
		if(data['from'] == chatID) {
			appendMessageToLog(data['txt'], data['from']);
			displayChatBubbles(message,false);
		} else {
			//window.plugins.statusBarNotification.notify(phoneContactsArray[data['from]'].getContactName() + " says:", data['txt']);
			navigator.notification.alert(data['txt'], null, phoneContactsArray[data['from]'].getContactName() + " says:", "Ok");
		}
	});
}

function sendMessage(message){
	if(message == '')
		return;
	socket.emit('message', {to:chatID, txt:message});
	appendMessageToLog(message, 0);
}

function appendMessageToLog(message, sender) {
	messageLog.push({ Message: message, Sender: sender });
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
                sendMessageUI();
        }
});

function sendMessageUI(){
        var message = $("#chatinput").val();
        displayChatBubbles(message,true);
        sendMessage(message);
}