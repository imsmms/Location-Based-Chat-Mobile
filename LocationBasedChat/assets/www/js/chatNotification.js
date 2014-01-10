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
		default:
			break;
		}
	});
}