/**
 * registration.js is the controller responsible for handling all the 
 * logic related to the registration process
 */

function initializeRegisteration(){
	var regheight = parseInt($("#wrap").height());
	var top = (parseInt(window.screen.height)/2) - (regheight/2);
	$("#wrap").css("top",top);
	console.log($('body').height()+" : "+$('body').width());
	$('#pagePort').height(parseInt(window.innerHeight));
	$('#pagePort').css("background-image","url('img/registrationChat.png')");
	$('#pagePort').css("background-repeat","no-repeat");
	$('#pagePort').css("background-size","100% 100%");
	console.log($('#pagePort').height()+" : "+$('#pagePort').width());
}

/**
 * registerUser is the function that initiates the registration process
 */
function registerUser(){
	userName = $("#userNameID").val();//"Ibrahim";
	phoneNumber = $("#userPhoneNumber").val();//"01026357328";

	/**analytics**/
	ga('send', 'event', 'button', 'click', 'Register button');
	
	if(!validateRegisterationInfo(userName,phoneNumber)){
		return;
	}

	navigator.notification.activityStart("Please wait for registration process", "loading");
	getPhoneContacts();
}

/**
 * validateRegisterationInfo is the function responsible for client validation
 * of registration info
 * @param username
 * @param phonenumber
 * @returns {Boolean}
 */
function validateRegisterationInfo(username,phonenumber){
	if(username == undefined || username == null || 
			phonenumber == undefined || phonenumber == null){
		alert(EMPTY_USERNAME_PASSWORD);
		return false;
	}
	if(username.length == 0 || phonenumber.length == 0){
		alert(EMPTY_USERNAME_PASSWORD);
		return false;
	}else if(phonenumber.length > 20){
		alert(PHONE_NUMBER_EXCEEDS_LIMIT);
		return false;
	}else{
		return true;
	}
}

/**
 * getPhoneContacts is the function responsible for getting the phone contacts
 */
function getPhoneContacts(){
	var options = new ContactFindOptions();
	options.filter="";          // empty search string returns all contacts
	options.multiple=true;      // return multiple results
	filter = ["displayName", "name", "phoneNumbers","photos","emails"];
	// find contacts
	navigator.contacts.find(filter, getPhoneContactsSuccess, null, options);
}

/**
 * getPhoneContactsSuccess is the success callback of getPhoneContacts which
 * parse the contacts and form the contacts array structure
 * @param contacts
 */
function getPhoneContactsSuccess(contacts){
	console.log("# of contacts: " + contacts.length);
	var phoneContactsArrayCount = 0;
	for(var i=0;i<contacts.length;i++){
		//phoneContacts[i] = new Contact();
		//phoneContacts[i].contactName = contacts[i].displayName;
		if(contacts[i].phoneNumbers){
			for(var j=0;j<contacts[i].phoneNumbers.length;j++){
				phoneContactsArray[phoneContactsArrayCount] = contacts[i].phoneNumbers[j].value.replace(/\D/g,'');
				//phoneContacts[i].contactPhones[j] = contacts[i].phoneNumbers[j].value;
				namePhoneMapping[contacts[i].phoneNumbers[j].value.replace(/\D/g,'')] = contacts[i].displayName;
				phoneContactsArrayCount++;
			}	
		}
	}
	console.log(JSON.stringify(phoneContactsArray));
	if(isnearBy){
		//window.location = "nearByContactsMap.html";
		$("#pagePort").load("nearByContactsMap.html", function(){
			$('#pagePort').css("background-image","none");
			$('#pagePort').trigger("create");
			/**analytics**/
			ga('send', 'pageview', {
				'page': 'nearByContactsMap.html',
				'title': 'Friends finder map'
			});
			initializeNearBy();
			registerNewSocket();
		});
		return;
	}
	console.log("hello geo");
	getMyLocation();
}

function getMyLocation(){
	
	var options = { timeout: 5000, enableHighAccuracy: true, maximumAge: 90000 };
	navigator.geolocation.getCurrentPosition(getCurrentPositionSuccess, getCurrentPositionError,options);
}

function getCurrentPositionSuccess(position){
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;


	var url = BASE_URL + REGISTER_API + userName + "/" + phoneNumber + "/" + lng + "/" + lat + "/" + JSON.stringify(phoneContactsArray);

	console.log(url);
	$.getJSON(url,function(data){
		navigator.notification.activityStop();
		console.log(data.id);
		saveUserId(data.id);
	}).fail(function() {
		console.log( "error" );
	});
}

function getCurrentPositionError(data){
	console.log(JSON.stringify(data));
	cordova.exec(getCurrentPositionNativeSuccess, function(err) {
		getCurrentPositionNativeSuccess('null');
	}, "LocationPlugin", "getLocation", "");
	//alert("Cant load location");
}

function getCurrentPositionNativeSuccess(location){
	
	if(location == "null"){
		alert("Cant load location");
		return;
	}
	
	var position = {
			coords : {
				latitude : location[0],
				longitude : location[1]
			}
	};
	console.log("Hello Geo Native");
	console.log(JSON.stringify(position));
	navigator.notification.activityStop();
	getCurrentPositionSuccess(position);
}

function saveUserId(id){
	if(id == null || id == undefined || id ==""){
		alert(INVALID_USER_ID);
		return false;
	}
	userId = id;
	userName = "";
	phoneNumber = "";
	localStorage.setItem("UserID", id);
	if(localStorage.getItem("UserID")){
		$("#pagePort").load("nearByContactsMap.html", function(){
			$('#pagePort').css("background-image","none");
			$('#pagePort').trigger("create");
			
			/**analytics**/
			ga('send', 'pageview', {
				'page': 'nearByContactsMap.html',
				'title': 'Friends finder map after registration'
			});
			initializeNearBy();
			registerNewSocket();
		});
		return true;
	}
}

function getUserId(){
	if(localStorage.getItem("UserID")){
		userId = localStorage.getItem("UserID");
		console.log(userId);
		return true;
	}
	return false;


}
