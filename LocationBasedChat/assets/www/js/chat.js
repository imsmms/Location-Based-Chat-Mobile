var messageLog = [];
var socket;
var receiver_id;

function Inizialize(receiver){
	$("#friendName").html(chatID);
	var chatareaheight = parseInt($(window).height()) - 102;
	$("#chatarea").css("max-height",chatareaheight+"px");
	touchScroll('chatarea');

	var url = BASE_URL;
	socket = io.connect(BASE_URL);
	socket.emit('chat', {id: '01008993983'});
	socket.on('message', function(data) {
		if(data['from'] == null && data['from'] == '')
			return;
		if(data['from'] == receiver_id) {
			appendMessageToLog(data['txt'], data['from']);
			displayChatBubbles(message,false);
		} else {
			var options = new ContactFindOptions();
			options.filter=data['from'];          // empty search string returns all contacts
			options.multiple=false;      // return multiple results
			filter = ["displayName", "name"];
			// find contacts
			navigator.contacts.find(filter, function(contacts) {
				if(contacts.length > 0)
					//window.plugins.statusBarNotification.notify(contacts[0].displayName + " says:", data['txt']);
					navigator.notification.alert(data['txt'], null, contacts[0].displayName + " says:", "Ok");
				else
					//window.plugins.statusBarNotification.notify(data['from'] + " says:", data['txt']);
					navigator.notification.alert(data['txt'], null, data['from'] + " says:", "Ok");
			}, function() {
				//window.plugins.statusBarNotification.notify(data['from'] + " says:", data['txt']);
				navigator.notification.alert(data['txt'], null, data['from'] + " says:", "Ok");
			}, options);
		}
	});
}

function sendMessage(message){
	if(message == '')
		return;
	socket.emit('message', {to:'01008993983', txt:message});
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