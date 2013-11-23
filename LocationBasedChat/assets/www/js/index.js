/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function initialize() {

	google.maps.event.addDomListener(window, 'load', function(){
		setup();
	});

}

function setup() {
	document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady() {
	// get device's geographical location and return it as a Position object (which is then passed to onSuccess)
	navigator.geolocation.getCurrentPosition(onSuccess, onError);

}

function getContacts(loc){
	var url = BASE_URL + NEAR_CONTACTS_API + "01222222222/:" + loc.pb +"/:" + loc.ob;
	$.getJSON(url,function(data){
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
	});
}

function onSuccess(position){
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
	getContacts(myLocation);
}

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
	
	google.maps.event.addListener(infowindow, 'closeclick', function () {
		window.location = "chat.html";
	});
}

function onError(){
	alert("Cant load location");
}
