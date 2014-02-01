/**
 * chat.js is the controller that responsible for all the logic related to chat
 */

var messageLog = [];
var chatHistoryCounter = 0;
var isKeyBoardShown = false;
var isKeyBoardDisappears = false;

function Initialize(){
	
	console.log("Hello chat");
	
	$(document).keydown(function(e) {
		if(e.which == 13) {
			sendMessageUI();
		}
	});
	
	if(chatHistory[chatHistoryIndex] && chatHistory[chatHistoryIndex].history.length > 0){
		for(var i=0;i<chatHistory[chatHistoryIndex].history.length;i++){
			displayChatBubbles(chatHistory[chatHistoryIndex].history[i].message,chatHistory[chatHistoryIndex].history[i].isSender,true);
		}
		console.log("History fill");
	}
	
	if(socket == null) {
		var url = BASE_URL;
		socket = io.connect(BASE_URL);
	}
	//socket.emit('register', {id: userId}, function() { return; });
	
	if(groupChatFlag) {
		InitGroupChat();
	} else {
		if(namePhoneMapping[chatID]){
			$("#friendName").html(namePhoneMapping[chatID]);
		}else{
			$("#friendName").html(chatID);
		}
		
	}
	var chatareaheight = parseInt($(window).height()) - 102;
	$("#chatarea").css("max-height",chatareaheight+"px");
	/*var chatinputWidth = parseInt($(window).width()) - 40;
	var chatimgWidth = 40;
	$("#chatinput").css("width",chatinputWidth+"px");
	$("#chatImgID").css("width",chatimgWidth+"px");*/
	
	touchScroll('chatarea');
	
	socket.on('message', function(data) {
		
		console.log(JSON.stringify(data));
		
		console.log("________________________________________________");
		console.log(chatID);
		if(data['from'] == null || data['from'] == '')
			return;
		if (data['group'] && data['group'] === chatID) {
			appendMessageToLog(data['txt'], data['from']);
			var tmpMsg = (namePhoneMapping[data['from']] ? namePhoneMapping[data['from']] : data['from'])
				+ ": " + data['txt'];
			displayChatBubbles(tmpMsg,false,false);
		}
		else if(data['from'] && data['from'] == chatID) {
			appendMessageToLog(data['txt'], data['from']);
			displayChatBubbles(data['txt'],false,false);
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
	displayChatBubbles(data.message,false,false);
}

function sendMessage(message){
	if(message == '')
		return;
	
	if(groupChatFlag){
		socket.emit('message', {'group':chatID, 'txt':message});
	}else{
		socket.emit('message', {to:chatID, txt:message});
	}
	
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

function displayChatBubbles(message,isSender,isHistory){
	if(message == '')
		return;
	var appendedHTML = "";
	if(isSender){
		appendedHTML = "<p class=\"triangle-border right\">"+message+"<\/p>";
		
		/**analytics**/
		ga('send', 'event', 'button', 'click', 'Send message button');
		//alert(appendedHTML);
	}else{
		appendedHTML = "<p class=\"triangle-border left\">"+message+"<\/p>";
		
		/**analytics**/
		ga('send', 'event', 'Recieve message', 'retrieve', 'Recieve message');
	}
	$("#chatarea").append(appendedHTML);
	if(!isHistory){
		chatHistory[chatHistoryIndex].history.push({"isSender" : isSender,"message" : message});
	}
}

function sendMessageUI(){
	var message = $("#chatinput").val();
	$("#chatinput").val('');
	displayChatBubbles(message,true,false);
	sendMessage(message);
}

function ShowGroupSelect() {
	$('#contactList').empty().val('');
	console.log(nearByContacts);
	for(var i = 0; i < nearByContacts.length; i++) {
		if(ChatGroups[chatID].groupMembers.indexOf([nearByContacts[i].number]) != -1)
			$('#contactList').append('<option value="' + nearByContacts[i].contactPhone + '">' + nearByContacts[i].contactName + '</option>');
	}
	//$('#contactList').multiselect();
	$('#groupMembers').show();
	$('#btnManage').click(AddMembers);
}

function ShowGroupMembers() {
	$('#contactList').empty().val('');
	var members = ChatGroups[chatID].groupMembers;
	for(var i = 0; i < members.length; i++) {
		$('#contactList').append('<option value="' + members[i] + '">' + namePhoneMapping[members[i]] + '</option>');
	}
	//$('#contactList').multiselect();
	$('#groupMembers').show();
	$('#btnManage').click(RemoveMembers);
}

function AddMembers() {
	var members = $('#contactList').val();
	socket.emit('add-to-group', { group: chatID, members: members });
	foreach(member in members)
		ChatGroups[chatID].groupMembers.push(member);
	InitGroupChat();
	CancelAction();
}

function RemoveMembers() {
	console.log("remove member");
	var members = $('#contactList').val();
	console.log(members);
	socket.emit('remove-from-group', { group: chatID, members: members });
	for(var i = 0; i < members.length; i++) {
		console.log(members[i]);
		var index = ChatGroups[chatID].groupMembers.indexOf(members[i]);
		ChatGroups[chatID].groupMembers.splice(index, 1);
	}
	InitGroupChat();
	CancelAction();
}

function CancelAction() {
	$('#groupMembers').hide();
}

function InitGroupChat() {
	if(chatID == null) {
		socket.emit('create-group', {userId: userId, groupName: groupName},function(groupID){
			chatID = groupID;
			socket.emit('add-to-group',{groupId: chatID , members: groupChatIDs});
			ChatGroups[chatID] = new Group();
			ChatGroups[chatID].groupID = chatID;
			ChatGroups[chatID].groupMembers = groupChatIDs;
			ChatGroups[chatID].isAdmin = true;
			ChatGroups[chatID].groupName = groupName;
			groupChatEntryFunc();
		});
	}else{
		groupChatEntryFunc();
	}
}

function groupChatEntryFunc() {
	$('#groupChat').show();
	if(chatID == null) {
		$('#manageGroup').show();
	} else if (ChatGroups[chatID] && ChatGroups[chatID].isAdmin) {
		$('#manageGroup').show();
	} else {
		$('#manageGroup').hide();
	}
	var members = ChatGroups[chatID] == null ? groupChatIDs : ChatGroups[chatID].groupMembers;
	var friends = "";
	for(var i=0;i<members.length;i++) {
		friends += namePhoneMapping[members[i]] + ',';
	}
	friends += "You";
	$("#friendName").html(ChatGroups[chatID] ? ChatGroups[chatID].groupName : "Group");
	$("#friendStatus").html(friends);
}

function LeaveGroup() {
	socket.emit('leave-group', { group: chatID });
	GroupChats[chatID] = null;
	$("#pagePort").load(pageHistory.pop(), function(){
		$('#pagePort').trigger("create");
		chatID = 0;
		groupChatFlag = false;
	});
}

window.onresize = function(){
	console.log("hello Rsize");
	if(isKeyBoardShown){
		var windowHightAdj = parseInt($(window).height()) - 20;
		$("#pagePort").css("height",windowHightAdj);
		isKeyBoardShown = false;
	}
	if(isKeyBoardDisappears){
		var windowHightAdj = parseInt($(window).height()) - 20;
		$("#pagePort").css("height",windowHightAdj);
		isKeyBoardDisappears = false;
	}
	
};

function keyBoardAppears(){
	console.log("hello shown");
	isKeyBoardShown = true;
}

function keyBoardDisappears(){
	console.log("hello dissapear");
	isKeyBoardDisappears = true;
}