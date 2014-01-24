

function registerNewSocket() {
	navigator.notification.activityStart("", "loading Friends NearBy");
	socket = io.connect(BASE_URL);
	
	socket.on('connect',function(data){
		socket.emit('register', {id: userId}, function() { 
			getUserLocation();
		});
	});
	
	
	socket.on('message', function(data) {
		if(data['from'] == null && data['from'] == '')
			return;
		window.plugins.statusBarNotification.notify(namePhoneMapping[data['from']] || data['from'] + " says:", data['txt'], 0);
		//navigator.notification.alert(data['txt'], null, data['from'] + " says:", "Ok");
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
				namePhoneMapping[data.by] + ' has added you to a group. Do you want to join?',
				function(btn) {
					if(btn == 1) {
						ChatGroups[data.group] = new Group();
						ChatGroups[data.group].groupID = data.group;
						ChatGroups[data.group].groupName = data.groupName;
						ChatGroups[data.group].groupMembers = data.members;
						pageHistory.push("nearByContactsMap.html");
						$("#pagePort").load("chat.html", function(){
							$('#pagePort').trigger("create");
						});
					} else {
						socket.emit('leave-group', { group: data.group });
					}
				},
				'Group Invite',
				'Join,Leave'
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
