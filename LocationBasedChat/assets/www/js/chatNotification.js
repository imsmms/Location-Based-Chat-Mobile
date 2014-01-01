$(document).ready(function() {
	socket = io.connect(BASE_URL);
	socket.on('message', function(data) {
		if(data['from'] == null && data['from'] == '')
			return;
		window.plugins.statusBarNotification.notify(phoneContactsArray[data['from']] + " says:", data['txt'], 0);
		//navigator.notification.alert(data['txt'], null, data['from'] + " says:", "Ok");
	});
	socket.on('notification', function(data) {
		if(GroupChat[data.groupID] == null) {
			navigator.notification.confirm(
				namePhoneMapping[data.by] + ' has added you to a group. Do you want to join?',
				function(btn) {
					if(btn == 1) {
						GroupChat[data.groupID] = new Group();
						GroupChat[data.groupID].groupID = data.groupID;
						GroupChat[data.groupID].groupName = data.groupName;
						GroupChat[data.groupID].groupMembers = Members;
					} else {
						socket.emit('leave-group', { groupID: data.groupID });
					}
				},
				'Group Invite',
				'Join,Leave'
			);
		} else {
			foreach(var member in data.members)
				GroupChat[data.groupID].groupMembers.push(member);
		}
	});
});