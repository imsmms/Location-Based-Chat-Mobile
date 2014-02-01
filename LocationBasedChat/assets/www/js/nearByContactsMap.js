/**
 * nearByContactsMap.js is the controller responsible for getting
 * and showing your nearby contacts on the map
 */


/**
 * initializeNearBy
 */

function initializeNearBy(){
	//var headerHeight = (windowHight * 10)/100;
	$("#chatHeader").height("100px");
	headerHeight = parseInt($("#chatHeader").height());
	//$("#moredots").height(windowHight/7);
	$("#chatHeader").css("background-size","100% 100%");
	$("#geoLocation").css("top","100px");
	isInNearBy = true;
}


/**
 * getUserLocation is the function responsible for getting user location
 */
function getUserLocation(){
	//navigator.notification.activityStart("", "loading Friends NearBy");
	var options = { timeout: 5000, enableHighAccuracy: true, maximumAge: 90000 };
	navigator.geolocation.getCurrentPosition(getUserLocationSuccess, getUserLocationError,options);
}

/**
 * getUserLocationSuccess is getUserLocation success callback
 * @param position
 */
function getUserLocationSuccess(position){
	var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	console.log(JSON.stringify(myLocation));
	var geolochight = parseInt(window.screen.height) - 50;
	$("#geoLocation").height(geolochight);
	//$("#geoLocation").width($(window).width);
	map  = new google.maps.Map(document.getElementById('geoLocation'), {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: myLocation,
		zoom: 15
	}); 
	
	locObj = {position : myLocation,name : "my location"};

	createMarker(locObj,"img/orangepin.png");
	//getContactslocally();
	getNearByContacts(myLocation);
}

function getUserLocationError(){
	cordova.exec(getCurrentPositionNearByNativeSuccess, function(err) {
		getCurrentPositionNearByNativeSuccess('null');
	}, "LocationPlugin", "getLocation", "");
}

function getCurrentPositionNearByNativeSuccess(location){
	
	if(location == "null"){
		alert(Location_Error);
		return;
	}
	
	var position = {
			coords : {
				latitude : location[0],
				longitude : location[1]
			}
	};
	getUserLocationSuccess(position);
}


/**
 * createMarker is the function responsible for creating map pins
 * @param markerObj
 * @param pinColor
 */
function createMarker(markerObj,pinImg){
	
	//var pinColor = "FE7569";
    /*var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));*/
	
	var marker = new google.maps.Marker({
		map: map,
		position: markerObj.position,
		title:markerObj.position.d + ", " + markerObj.position.e,
		animation: google.maps.Animation.DROP,
		icon: pinImg
	}); 
	//var infowindow;
	if(markerObj.name == "my location"){
		marker.infowindow = new google.maps.InfoWindow({
	        content: markerObj.name
	    });
	}else{
		var contentString = createInfoWindowContent(markerObj.name,markerObj.number);
		console.log(contentString);
		
		marker.infowindow = new google.maps.InfoWindow({
	        content: contentString
	    });
	}
	
	
	
	google.maps.event.addListener(marker, 'click', function () {
		marker.infowindow.open(map, marker);
	});
	
	markersArray.push(marker);
	
	/*google.maps.event.addListener(infowindow, 'closeclick', function () {
		window.location = "chat.html";
	});*/
}


function createInfoWindowContent(name,id){
	var chatbutton = "Chat";
	if(groupChatFlag){
		chatbutton = "Open Group Chat";
	}
	var infoWindow="<div style=\"width:320px; height:150px;\">";
	infoWindow += "	<div style=\"width: 100%; position: absolute; top: 0px; height: 80px;\">";
	infoWindow += "<img alt=\"\" src=\"img\/user.png\"";
	infoWindow += "	style=\"width: 40px; height: 40px; position: absolute; top: 10px; left: 10px;\">";
	infoWindow += "	<div style=\"position: absolute; left: 60px; top: 10px; color: black; font-size: 15px;\"";
	infoWindow += "	id=\"friendName\">"+name+"<\/div>";
	infoWindow += "	<div style=\"position: absolute; left: 60px; top: 30px; color: black; font-size: 10px;\"";
	infoWindow += "	id=\"friendStatus\">friend status<\/div>";
	infoWindow += "	<button style=\"position: absolute; top: 60px; left: 8px; right: 8px;\"";
	infoWindow += "	onclick=\"addToGroup(this.id)\" id=\""+id+"_"+"\">Add to group<\/button>";
	infoWindow += "	<button style=\"position: absolute; top: 95px; left: 8px; right: 8px;\"";
	infoWindow += "	onclick=\"OpenChat(this.id)\" id=\""+id+"\">"+chatbutton+"<\/button>";
	infoWindow += "	<\/div><\/div>";
	return infoWindow;
}


function OpenChat(id){
	if(groupChatFlag){
		
		/**analytics**/
		ga('send', 'event', 'button', 'click', 'Group Chat button');
		
		chatID = null;
		if(groupChatIDs.indexOf(id.split("_")[0]) == -1) {
			groupChatIDs[groupChatCounter] = id.split("_")[0];
		}
		var group = prompt("Please enter group name","");
		if(group == null){
			return;
		}
		while(group == ''){
			group = prompt("Please enter group name","");
			if(group == null){
				return;
			}
		}
		
		groupName = group;
		if(!chatHistory[group+"__"]){
			//var chatItem = "<li><a onclick=\"openChatWindowFromHistory(this.id)\" id=\""+group+"__"+"\">"+group+"<\/a><\/li>";
			//$("#chatHistory").append(chatItem);
			chatHistory[group+"__"] = {"isGroup":true,"history":[]};
		}
		chatHistoryIndex = group+"__";
	}else{
		
		/**analytics**/
		ga('send', 'event', 'button', 'click', 'Chat button');
		
		chatID = id;
		if(!chatHistory[id+"__"]){
			//var chatItem = "<li><a onclick=\"openChatWindowFromHistory(this.id)\" id=\""+id+"__"+"\">"+namePhoneMapping[id]+"<\/a><\/li>";
			//$("#chatHistory").append(chatItem);
			chatHistory[id+"__"] = {"isGroup":false,"history":[]};
		}
		chatHistoryIndex = id+"__";
	}
	
	
	//window.location = "chat.html";
	pageHistory.push("nearByContactsMap.html");
	$("#pagePort").load("chat.html", function(){
		$('#pagePort').trigger("create");
		$('#pagePort').height(parseInt(window.innerHeight));
		$('#pagePort').css("background-image","url('img/registrationChat.png')");
		$('#pagePort').css("background-repeat","no-repeat");
		$('#pagePort').css("background-size","100% 100%");
		ga('send', 'pageview', {
			'page': 'chat.html',
			'title': 'Chat'
		});
	});
}

function openChatWindowFromHistory(id){
	chatHistoryIndex = id;
	chatID = id.split("_")[0];
	groupChatFlag = chatHistory[chatHistoryIndex].isGroup;
	console.log(chatHistoryIndex);
	pageHistory.push("nearByContactsMap.html");
	$("#pagePort").load("chat.html", function(){
		$('#pagePort').trigger("create");
		$('#pagePort').height(parseInt(window.innerHeight));
		$('#pagePort').css("background-image","url('img/registrationChat.png')");
		$('#pagePort').css("background-repeat","no-repeat");
		$('#pagePort').css("background-size","100% 100%");
	});
}

function addToGroup(id){
	
	/**analytics**/
	ga('send', 'event', 'button', 'click', 'Add to Group button');
	
	
	if(groupChatIDs.indexOf(id.split("_")[0]) == -1){
		groupChatIDs[groupChatCounter] = id.split("_")[0];
		groupChatCounter++;
		groupChatFlag = true;
		
	}

	for(var i=0;i<markersArray.length;i++){
		markersArray[i].infowindow.close();
	}
}

/**
 * getNearByContacts is the function responsible for getting nearby contacts
 * @param loc
 */
function getNearByContacts(loc){
	var url = BASE_URL + NEAR_CONTACTS_API + userId + "/" + loc.e +"/" + loc.d + "/5";
	console.log(url);
	$.getJSON(url,getNearByContactsSuccess).fail(function() {
	    console.log( "error" );
		//fake data
//	    var contactObj = {};
//		contactObj.name = "Ibrahim";
//		contactObj.number = "01025600901";
//		var contactLoc = new google.maps.LatLng(30.02, 31.216);
//		contactObj.position = contactLoc;
//		createMarker(contactObj,"67F097");
	  });
}

/**
 * getNearByContactsSuccess is getNearByContacts success callback
 * @param data
 */
function getNearByContactsSuccess(data){
	console.log(JSON.stringify(data));
	var contactObj = {};
	for(var i = 0;i<data.contacts.length;i++){
		contactObj.name = namePhoneMapping[data.contacts[i].number];
		contactObj.number = data.contacts[i].number;
		if(!contactObj.name){
			contactObj.name = namePhoneMapping["+2"+data.contacts[i].number];
		}
		var lat = data.contacts[i].loc.coordinates[1];
		var lng = data.contacts[i].loc.coordinates[0];
		var contactLoc = new google.maps.LatLng(lat, lng);
		contactObj.position = contactLoc;
		createMarker(contactObj,"img/greenpin.png");
		
		onlineUsers.push(data.contacts[i].number);
	}
	navigator.notification.activityStop();
	fillNearByContacts(data);
	
	//fake data
	contactObj.name = "Nourhan";
	contactObj.number = "01067310900";
	var contactLoc = new google.maps.LatLng(30.02422, 31.21413);
	contactObj.position = contactLoc;
	createMarker(contactObj,"img/greenpin.png");
}

function fillNearByContacts(data){
	if(data.contacts){
		for(var i = 0;i<data.contacts.length;i++){
			nearByContacts[i] = new Contact();
			nearByContacts[i].contactPhone = data.contacts[i].number;
			nearByContacts[i].contactName = namePhoneMapping[data.contacts[i].number];
		}
	}else{
		var newContact = new Contact();
		nearByContacts[nearByContacts.length] = new Contact();
		newContact.contactPhone = data.contact;
		newContact.contactName = namePhoneMapping[data.contact];
		nearByContacts.push(newContact);
	}
	
}

function addNewOnlineUserToMap(data){
	var contactObj = {};
	contactObj.name = namePhoneMapping[data.contact];
	
	if(!contactObj.name){
		contactObj.name = namePhoneMapping["+2"+data.contact];
	}
	
	contactObj.number = data.contact;
	var lat = parseFloat(data.loc[1]);
	var lng = parseFloat(data.loc[0]);
	var contactLoc = new google.maps.LatLng(lat, lng);
	contactObj.position = contactLoc;
	createMarker(contactObj,"../img/greenpin.png");
	fillNearByContacts(data);
}

function removeUserFromMap(data){
	var index = onlineUsers.indexOf(data.contact);
	if (index > -1) {
		onlineUsers.splice(index, 1);
		markersArray[index].setMap(null);
		markersArray.splice(index, 1);
	}
}

function openMenu(){
	
	/**analytics**/
	ga('send', 'event', 'button', 'click', 'Open legt menu button');
	
	$("#mypanel").panel("open");
}

function refreshNearBy(){
	/**analytics**/
	ga('send', 'event', 'button', 'click', 'Refresh near by button');
	
	$("#mypanel").panel("close");
	getUserLocation();
}

function hideMyLocation(){
	
	/**analytics**/
	ga('send', 'event', 'button', 'click', 'Hide my location button');
	
	var url = BASE_URL + "/hide/" + userId;
	$.post(url,showHideSuccess).fail(function() {
	    console.log( "error hiding" );
	});
}

function showMyLocation(){
	
	/**analytics**/
	ga('send', 'event', 'button', 'click', 'Show my location button');
	
	var url = BASE_URL + "/show/" + userId;
	$.post(url,showHideSuccess).fail(function() {
	    console.log( "error showing" );
	});
}

function showHideSuccess(data){
	console.log(JSON.stringify(data));
}

function openRightMenu(){
	/**analytics**/
	ga('send', 'event', 'button', 'click', 'Open right menu button');
	
	$("#myrightpanel").panel("open");
}

function openNearBy(){
	if(!isInNearBy){
		$("#pagePort").load("nearByContactsMap.html", function(){
			isInNearBy = true;
			isInChatList = false;
			$('#pagePort').css("background-image","none");
			$('#pagePort').trigger("create");
			
			/**analytics**/
			ga('send', 'pageview', {
				'page': 'nearByContactsMap.html',
				'title': 'Friends finder map after registration'
			});
		});
	}
}

function openChatList(){
	if(!isInChatList){
		renderChatList();
		$("#pagePort").load("chatlist.html", function(){
			isInNearBy = false;
			isInChatList = true;
			$("#chatlistcontainer").height((windowHight - 100) + "px");
			$('#chatlistcontainer').css("background-image","url('img/registrationChat.png')");
			$('#chatlistcontainer').css("background-repeat","no-repeat");
			$('#chatlistcontainer').css("background-size","100% 100%");
			
			
			$("#chatList").html($("#chatHistory").html());
			$('#pagePort').trigger("create");
			/**analytics**/
			ga('send', 'pageview', {
				'page': 'chatlist.html',
				'title': 'Friends finder map after registration'
			});
		});
	}
}

function addChatListItem(chathistoryid,name,lastchat){
	var strVar="";
	strVar += "<li onclick=\"openChatWindowFromHistory(this.id)\" id=\""+chathistoryid+"\">";
	strVar += "	<img alt=\"\" src=\"img\/user.png\">";
	strVar += "	<h3>"+name+"<\/h3>";
	strVar += "	<p>"+lastchat+"<\/p>";
	strVar += "<\/li>";
}

function renderChatList(){
	for(var chathistoryid in chatHistory){
		var listitemid = chathistoryid.split("_")[0];
		var name = "";
		if(chatHistory[chathistoryid].isGroup){
			name = listitemid;
		}else{
			name = namePhoneMapping[listitemid];
		}
		//var chatItem = "<li><a onclick=\"openChatWindowFromHistory(this.id)\" id=\""+chathistoryid+"\">"+name+"<\/a><\/li>";
		var chatItem = addChatListItem(chathistoryid,name,chatHistory[chathistoryid].history[chatHistory[chathistoryid].history.length - 1]);
		$("#chatHistory").append(chatItem);
	}
}