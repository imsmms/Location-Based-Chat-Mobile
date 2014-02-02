/**
 * chat.js is the controller that responsible for all the logic related to chat
 */

var messageLog = [];
var chatHistoryCounter = 0;
var isKeyBoardShown = false;
var isKeyBoardDisappears = false;

function Initialize(){
	
	console.log("Hello chat");
	isInNearBy = false;
	
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
	$("#chatheader").attr("onclick","");
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
	$('#contactList option').remove();
	console.log(JSON.stringify(nearByContacts));
	for(var i = 0; i < nearByContacts.length; i++) {
		if(ChatGroups[chatID].groupMembers.indexOf([nearByContacts[i].contactPhone]) == -1)
			$('#contactList').append('<option value="' + nearByContacts[i].contactPhone + '">' + nearByContacts[i].contactName + '</option>');
	}
	$('#groupMembers').show();
	$('#btnManage').attr('m', "add");
}

function ShowGroupMembers() {
	$('#contactList option').remove();
	var members = ChatGroups[chatID].groupMembers;
	for(var i = 0; i < members.length; i++) {
		$('#contactList').append('<option value="' + members[i] + '">' + namePhoneMapping[members[i]] + '</option>');
	}
	$('#groupMembers').show();
	$('#btnManage').attr('m', "remove");
}

function AddMembers() {
	if($('#btnManage').attr('m') == "remove") {
		RemoveMembers();
		return;
	}
	var members = $('#contactList').val();
	socket.emit('add-to-group', { groupId: chatID, members: members });
	for(var i = 0; i < members.length; i++)
		ChatGroups[chatID].groupMembers.push(members[i]);
	InitGroupChat();
	CancelAction();
}

function RemoveMembers() {
	var members = $('#contactList').val();
	console.log(members);
	socket.emit('remove-from-group', { group: chatID, members: members });
	for(var i = 0; i < members.length; i++) {
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
	$("#chatheader").attr("onclick","openGroupInfo()");
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
	chatID = null;
	$("#pagePort").load("nearByContactsMap.html", function(){
		isInNearBy = true;
		isInChatList = false;
		$('#pagePort').css("background-image","none");
		$('#pagePort').trigger("create");
		initializeNearBy();
		getUserLocation();
		
		/**analytics**/
		ga('send', 'pageview', {
			'page': 'nearByContactsMap.html',
			'title': 'Friends finder map after registration'
		});
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