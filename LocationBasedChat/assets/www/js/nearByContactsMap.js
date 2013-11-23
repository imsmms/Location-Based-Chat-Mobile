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
	$("#geoLocation").height(window.screen.height);
	$("#geoLocation").width($(window).width);
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
	var infowindow  = new google.maps.InfoWindow({
        content: markerObj.name
    });
	
	
	google.maps.event.addListener(marker, 'click', function () {
		infowindow.open(map, marker);
	});
	
	/*google.maps.event.addListener(infowindow, 'closeclick', function () {
		window.location = "chat.html";
	});*/
}

/**
 * getNearByContacts is the function responsible for getting nearby contacts
 * @param loc
 */
function getNearByContacts(loc){
	var url = BASE_URL + NEAR_CONTACTS_API + userId + "/:" + loc.pb +"/:" + loc.ob;
	$.getJSON(url,getNearByContactsSuccess);
}

/**
 * getNearByContactsSuccess is getNearByContacts success callback
 * @param data
 */
function getNearByContactsSuccess(data){
	console.log(JSON.stringify(data));
	var contactObj = {};
	for(var i = 0;i<data.contacts.length;i++){
		contactObj.name = data.contacts[i].name;
		var lat = data.contacts[i].position[0];
		var lng = data.contacts[i].position[1];
		var contactLoc = new google.maps.LatLng(lat, lng);
		contactObj.position = contactLoc;
		createMarker(contactObj,"67F097");
	}
}