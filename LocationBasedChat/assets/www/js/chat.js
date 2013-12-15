/**
 * chat.js is the controller that responsible for all the logic related to chat
 */

var messageLog = [];

function Initialize(){
	$("#friendName").html(namePhoneMapping[chatID]);
	var chatareaheight = parseInt($(window).height()) - 102;
	$("#chatarea").css("max-height",chatareaheight+"px");
	touchScroll('chatarea');
	
	var url = BASE_URL;
	if(socket == null)
		socket = io.connect(BASE_URL);
	
	if(chatID === "0")
		ShowGroupSelect();
	}
	socket.emit('chat', {id: userId});
	socket.on('message', function(data) {
		if(data['from'] == null || data['from'] == '')
			return;
		if (data['groupID'] && data['groupID'] == chatID) {
			appendMessageToLog(data['txt'], data['from']);
			displayChatBubbles(data['txt'],false);
		}
		else if(data['from'] && data['from'] == chatID) {
			appendMessageToLog(data['txt'], data['from']);
			var tmpMsg = (namePhoneMapping[data['from']] ? namePhoneMapping[data['from']] : data['from'])
				+ ": " + data['txt'];
			displayChatBubbles(tmpMsg,false);
		} else {
			window.plugins.statusBarNotification.notify(namePhoneMapping[data['from']] + " says:", {
				body: data['txt'],
				tag: 'Open Chat',
				onclick: function() { OpenChat(data['groupID'] || data['from']); }
			});
			//navigator.notification.alert(data['txt'], null, phoneContactsArray[data['from']] + " says:", "Ok");
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

function ShowGroupSelect() {
	$('#contactList').empty();
	for(var i = 0; i < nearByContacts.length; i++) {
		if(ChatGroups[chatID] == null || ChatGroups[chatID][nearByContacts[i].number] == null)
			$('#contactList').append('<option value="' + nearByContacts[i].contactPhone + '">' + nearByContacts[i].contactName + '</option>
	}
	$('#groupMembers').show();
}

function ShowGroupMembers() {
	$('#contactList').empty();
	var members = ChatGroups[chatID].groupMembers;
	for(var i = 0; i < members.length; i++) {
		$('#contactList').append('<option value="' + members[i] + '">' + namePhoneMapping[members[i]] + '</option>
	}
	$('#groupMembers').show();
}

function AddMembers() {
	var members = $('#contactList').val();
	socket.emit('group-chat', { groupID: chatID, members: members });
	if(chatID === '0')
		socket.on('group-chat', function(data) { chatID = data['groupID']; });
}

function CancelAction() {
	if(chatID == 0)
		return $("#pagePort").load("chat.html", function(){ });
	
	$('#groupMembers').hide();
}