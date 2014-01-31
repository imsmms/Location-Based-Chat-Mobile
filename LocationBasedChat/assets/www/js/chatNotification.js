

function registerNewSocket() {
	navigator.notification.activityStart("", "loading Friends NearBy");
	if(socket) {
		getUserLocation();
		return;
	}
	socket = io.connect(BASE_URL);
	
	socket.on('connect',function(data){
		socket.emit('register', {id: userId}, function() { 
			getUserLocation();
		});
	});
	
	
	socket.on('message', function(data) {
		if(chatID != null && chatID != 0)
			return;
		if(data['from'] == null && data['from'] == '')
			return;
		newChatID = data['groupID'] || data['from'];
		window.plugins.statusBarNotification.notify(namePhoneMapping[data['from']] + " says:", data['txt'], 0, switchChat);
		if(!chatHistory[newChatID+"__"]){
			var chatItem = "<li><a onclick=\"openChatWindowFromHistory(this.id)\" id=\""+newChatID+"__"+"\">"+namePhoneMapping[newChatID]+"<\/a><\/li>";
			$("#rightlist").append(chatItem);
			chatHistory[newChatID+"__"] = {"isGroup":data['groupID'] != null,"history":[]};
		}
		chatHistory[newChatID+"__"].history.push({"isSender" : false,"message" : data['txt']})
	});
	socket.on('notification', function(data) {
		console.log("Notification!!!");
		switch (notifyMeObject[data.event]){
		case 0:
			console.log("NearBy Notification!!!");
			addNewOnlineUserToMap(data);
			break;
		case 1:
			navigator.notification.confirm(
				namePhoneMapping[data.by] + ' has added you to a group.',
				function(btn) {
					if(btn == 1) {
						ChatGroups[data.groupId] = new Group();
						ChatGroups[data.groupId].groupID = data.groupId;
						ChatGroups[data.groupId].groupName = data.groupName;
						ChatGroups[data.groupId].groupMembers = data.members;
						pageHistory.push("nearByContactsMap.html");
						groupChatFlag = true;
						chatID = data.groupId;
						
						var chatItem = "<li><a onclick=\"openChatWindowFromHistory(this.id)\" id=\""+data.groupId+"__"+"\">"+data.groupName+"<\/a><\/li>";
						$("#rightlist").append(chatItem);
						chatHistory[data.groupId+"__"] = {"isGroup":true,"history":[]};
						chatHistoryIndex = data.groupId+"__";
						
						$("#pagePort").load("chat.html", function(){
							$('#pagePort').trigger("create");
						});
						console.log(JSON.stringify(data));
					} else {
						socket.emit('leave-group', { group: data.group });
					}
				},
				'Group Invite',
				'OK,Leave'
			);
			break;
		case 2:
			ChatGroups[data.group] = null;
			if(data.group == chatID)
				$('#pagePort').load('nearbycontactsmap.html', function() {});
			break;
		case 3:
				if(ChatGroups[data.group])
					ChatGroups[data.group].groupMembers.push(data.member);
			break;
		case 4:
			ChatGroups[data.group].groupMembers.remove(data.member);
			if(chatID == data.group)
				InitGroupChat();
			break;
		case 5:
			navigator.notification.alert("You have been removed from a group", null, "Remove Notification", "OK");
			if(chatID == data.group)
				$('#pagePort').load('nearbycontactsmap.html', function() { });
			ChatGroups[data.group] = null;
			break;
		default:
			break;
		}
	});
}

function switchChat() {
	OpenChat(newChatID);
}