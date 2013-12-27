/**
 * chat.js is the controller that responsible for all the logic related to chat
 */

var messageLog = [];
var newChatID = '';

function Initialize(){
	if(groupChatFlag){
		InitGroupChat();
	}else{
		$("#friendName").html(namePhoneMapping[chatID]);
		var url = BASE_URL;
		socket = io.connect(BASE_URL);
		socket.emit('register', {id: userId});
	}
	var chatareaheight = parseInt($(window).height()) - 102;
	$("#chatarea").css("max-height",chatareaheight+"px");
	touchScroll('chatarea');
	
	var url = BASE_URL;
	if(socket == null) {
		socket = io.connect(BASE_URL);
	}
	socket.emit('register', {id: userId});
	
	if(chatID === "0") {
		ShowGroupSelect();
		$('#manageGroup').show();
	}
	
	socket.on('message', function(data) {
		if(data['from'] == null || data['from'] == '')
			return;

		if (data['groupID'] && data['groupID'] == chatID) {
			appendMessageToLog(data['txt'], data['from']);
			var tmpMsg = (namePhoneMapping[data['from']] ? namePhoneMapping[data['from']] : data['from'])
				+ ": " + data['txt'];
			displayChatBubbles(tmpMsg,false);
		}
		else if(data['from'] && data['from'] == chatID) {
			appendMessageToLog(data['txt'], data['from']);
			displayChatBubbles(data['txt'],false);
		} else {
			newChatID = data['groupID'] || data['from'];
			window.plugins.statusBarNotification.notify(namePhoneMapping[data['from']] + " says:", data['txt'], 0, switchChat);
			//navigator.notification.alert(data['txt'], null, phoneContactsArray[data['from']] + " says:", "Ok");
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

function ShowGroupSelect() {
	$('#contactList').empty();
	for(var i = 0; i < nearByContacts.length; i++) {
		console.log(JSON.stringify(nearByContacts));
		if(ChatGroups[chatID] == null || !ChatGroups[chatID].members.contains([nearByContacts[i].number]))
			$('#contactList').append('<option value="' + nearByContacts[i].contactPhone + '">' + nearByContacts[i].contactName + '</option>');
	}
	$('#groupMembers').multiselect().show();
}

function ShowGroupMembers() {
	$('#contactList').empty();
	var members = ChatGroups[chatID].groupMembers;
	for(var i = 0; i < members.length; i++) {
		$('#contactList').append('<option value="' + members[i] + '">' + namePhoneMapping[members[i]] + '</option>');
	}
	$('#groupMembers').multiselect().show();
}

function AddMembers() {
	var members = $('#contactList').val();
	if(chatID === "0") {
		socket.emit('create-group', { id: userID }, function(groupID) {
			chatID = groupID;
		});
	}
	
	socket.emit('add-to-group', { group: chatID, numbers: members });
	InitGroupChat();
}

function CancelAction() {
	console.log('ChatID: ' + chatID);
	if(chatID === "0")
		return $("#pagePort").load("nearByContactsMap.html", function(){ });
	
	$('#groupMembers').hide();
}

function InitGroupChat() {
	if(chatID == '') {
		var url = BASE_URL;
		socket = io.connect(BASE_URL);
		socket.emit('create-group', {id: userId},function(groupID){
			chatID = groupID;
			socket.emit('add-to-group',{group:chatID , numbers:groupChatIDs});
			ChatGroups[chatID] = new Group() { groupID: chatID, groupMembers: groupChatIDs }
		});
	}
	
	var friends = "";
	for(var i=0;i<ChatGroups[chatID].groupMembers.length;i++) {
		friends += namePhoneMapping[ChatGroups[chatID].groupMembers[i]] + ',';
	}
	$("#friendName").html(friends);
	$("#friendStatus").html("Group");
}

function switchChat() {
	openChat(newChatID);
}
