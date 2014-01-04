$(document).ready(function() {
	socket = io.connect(BASE_URL);
	socket.on('message', function(data) {
		if(data['from'] == null && data['from'] == '')
			return;
		window.plugins.statusBarNotification.notify(namePhoneMapping[data['from']] || data['from'] + " says:", data['txt'], 0);
		//navigator.notification.alert(data['txt'], null, data['from'] + " says:", "Ok");
	});
	socket.on('notification', function(data) {
		switch (notifyMeObject[data.event]){
		case 0:
			addNewOnlineUserToMap(data);
			break;
		case 1:
			navigator.notification.confirm(
				namePhoneMapping[data.by] + ' has added you to a group. Do you want to join?',
				function(btn) {
					if(btn == 1) {
						GroupChat[data.group] = new Group();
						GroupChat[data.group].groupID = data.group;
						GroupChat[data.group].groupName = data.groupName;
						GroupChat[data.group].groupMembers = data.members;
					} else {
						socket.emit('leave-group', { group: data.group });
					}
				},
				'Group Invite',
				'Join,Leave'
			);
			break;
		case 2:
			GroupChat[data.group] = null;
			if(data.group == chatID)
				$('#pagePort').load('nearbycontactsmap.html', function() {});
			break;
		case 3:
				GroupChat[data.group].groupMembers.push(data.member);
			break;
		case 4:
			GroupChat[data.group].groupMembers.remove(data.member);
			if(chatID == data.group)
				InitGroupChat();
			break;
		case 5:
			navigator.notification.alert("You have been removed from a group", null, "Remove Notification", "OK");
			if(chatID == data.group)
				$('#pagePort').load('nearbycontactsmap.html', function() { });
			GroupChat[data.group] = null;
			break;
		default:
			break;
		}
	});
});