/**
 * nearByContactsMap.js is the controller responsible for getting
 * and showing your nearby contacts on the map
 */


/**
 * getUserLocation is the function responsible for getting user location
 */
function getUserLocation(){
	navigator.geolocation.getCurrentPosition(getUserLocationSuccess, getUserLocationError);
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

	createMarker(locObj,"FE7569");
	//getContactslocally();
	getNearByContacts(myLocation);
}

function getUserLocationError(){
	alert(Location_Error);
}

/**
 * createMarker is the function responsible for creating map pins
 * @param markerObj
 * @param pinColor
 */
function createMarker(markerObj,pinColor){
	
	//var pinColor = "FE7569";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
	
	var marker = new google.maps.Marker({
		map: map,
		position: markerObj.position,
		title:markerObj.position.ob + ", " + markerObj.position.pb,
		icon: pinImage
	}); 
	var infowindow;
	if(markerObj.name == "my location"){
		infowindow = new google.maps.InfoWindow({
	        content: markerObj.name
	    });
	}else{
		var contentString = createInfoWindowContent(markerObj.name,markerObj.number);
		console.log(contentString);
		
		infowindow = new google.maps.InfoWindow({
	        content: contentString
	    });
	}
	
	
	
	google.maps.event.addListener(marker, 'click', function () {
		infowindow.open(map, marker);
	});
	
	markersArray.push(marker);
	
	/*google.maps.event.addListener(infowindow, 'closeclick', function () {
		window.location = "chat.html";
	});*/
}


function createInfoWindowContent(name,id){
	var infoWindow="<div style=\"width:320px; height:140px;\">";
	infoWindow += "	<div style=\"width: 100%; position: absolute; top: 0px; height: 80px;\">";
	infoWindow += "<img alt=\"\" src=\"img\/user.png\"";
	infoWindow += "	style=\"width: 40px; height: 40px; position: absolute; top: 10px; left: 10px;\">";
	infoWindow += "	<div style=\"position: absolute; left: 60px; top: 10px; color: black; font-size: 15px;\"";
	infoWindow += "	id=\"friendName\">"+name+"<\/div>";
	infoWindow += "	<div style=\"position: absolute; left: 60px; top: 30px; color: black; font-size: 10px;\"";
	infoWindow += "	id=\"friendStatus\">friend status<\/div>";
	infoWindow += "	<button style=\"position: absolute; top: 60px; left: 8px; right: 8px;\"";
	infoWindow += "	onclick=\"addToGroup(this.id)\" id=\""+id+"_"+"\">Add to group<\/button>";
	infoWindow += "	<div style='height : 10px'><\/div><button style=\"position: absolute; top: 85px; left: 8px; right: 8px;\"";
	infoWindow += "	onclick=\"OpenChat(this.id)\" id=\""+id+"\">Chat<\/button>";
	infoWindow += "	<\/div><\/div>";
	return infoWindow;
}


function OpenChat(id){
	if(groupChatFlag){
		groupChatIDs[groupChatCounter] = id.split("_")[0];
	}else{
		chatID = id;
	}
	
	//window.location = "chat.html";
	pageHistory.push("nearByContactsMap.html");
	$("#pagePort").load("chat.html", function(){
		$('#pagePort').trigger("create");
	});
}

function addToGroup(id){
	groupChatIDs[groupChatCounter] = id.split("_")[0];
	groupChatCounter++;
	groupChatFlag = true;
	
	for(var i=0;i<markersArray.length;i++){
		markersArray[i].infowindow.close();
	}
}

/**
 * getNearByContacts is the function responsible for getting nearby contacts
 * @param loc
 */
function getNearByContacts(loc){
	var url = BASE_URL + NEAR_CONTACTS_API + userId + "/" + loc.ob +"/" + loc.nb + "/5";
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
		var lat = data.contacts[i].loc.coordinates[1];
		var lng = data.contacts[i].loc.coordinates[0];
		var contactLoc = new google.maps.LatLng(lat, lng);
		contactObj.position = contactLoc;
		createMarker(contactObj,"67F097");
	}
	fillNearByContacts(data);
	
	//fake data
//	contactObj.name = "Ibrahim";
//	contactObj.number = "01025600901";
//	var contactLoc = new google.maps.LatLng(30.02, 31.216);
//	contactObj.position = contactLoc;
//	createMarker(contactObj,"67F097");
}

function fillNearByContacts(data){
	for(var i = 0;i<data.contacts.length;i++){
		nearByContacts[i] = new Contact();
		nearByContacts[i].contactPhone = data.contacts[i].number;
		nearByContacts[i].contactName = namePhoneMapping[data.contacts[i].number];
	}
}

function openMenu(){
	$("#mypanel").panel("open");
}