/**
 * chat.js is the controller that responsible for all the logic related to chat
 */

var messageLog = [];
var socket;
var receiver_id;

function Inizialize(receiver){
	if(groupChatFlag){
		var friends = "";
		for(var i=0;i < groupChatIDs.length;i++){
			friends += " " + namePhoneMapping[groupChatIDs[i]];
		}
		$("#friendName").html(friends);
		$("#friendStatus").html("Group");
		var url = BASE_URL;
		socket = io.connect(BASE_URL);
		socket.emit('create-group', {id: userId},function(groupID){
			chatID = groupID;
			socket.emit('add-to-group',{group:chatID , numbers:groupChatIDs});
		});
	}else{
		$("#friendName").html(namePhoneMapping[chatID]);
		var url = BASE_URL;
		socket = io.connect(BASE_URL);
		socket.emit('register', {id: userId});
	}
	
	
	var chatareaheight = parseInt($(window).height()) - 102;
	$("#chatarea").css("max-height",chatareaheight+"px");
	touchScroll('chatarea');
	
	socket.on('message', function(data) {
		if(data['from'] == null && data['from'] == '')
			return;
		if(data['from'] == chatID) {
			//appendMessageToLog(data['txt'], data['from']);
			displayChatBubbles(namePhoneMapping[chatID] + ": " + data['txt'],false);
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
	
//	setInterval(recieveMessage,1000);
}
/**
 * PlanB
 */
function recieveMessage(){
	var url = BASE_URL + CHAT_RECIEVE + chatID + "/" + userId;
	$.getJSON(url,recieveMessageSuccess).fail(function() {
	    console.log( "error" );
	  });
}

function recieveMessageSuccess(data){
	displayChatBubbles(data.message,false);
}

function sendMessage(message){
	if(message == '')
		return;
	socket.emit('message', {to:chatID, txt:message});
	appendMessageToLog(message, 0);
	
	/**
	 * PlanB
	 */
//	var url = BASE_URL + CHAT_SEND + message + "/" + chatID;
//	$.getJSON(url,sendMessageSuccess).fail(function() {
//	    console.log( "error" );
//	  });
}

function sendSuccess(){
	console.log("Message sent!!");
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



