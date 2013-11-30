$(document).ready(function() {
	socket = io.connect(BASE_URL);
	socket.on('message', function(data) {
		if(data['from'] == null && data['from'] == '')
			return;
		//window.plugins.statusBarNotification.notify(data['from'] + " says:", data['txt']);
		navigator.notification.alert(data['txt'], null, data['from'] + " says:", "Ok");
	});
});