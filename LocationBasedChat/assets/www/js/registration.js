/**
 * registration.js is the controller responsible for handling all the 
 * logic related to the registration process
 */


/**
 * registerUser is the function that initiates the registration process
 */
function registerUser(){
	userName = "Ibrahim";//$("#userNameID").val();
	phoneNumber = "01026357328";//$("#userPhoneNumber").val();
	
	if(userName.length == 0 || phoneNumber.length == 0){
		alert(EMPTY_USERNAME_PASSWORD);
		return;
	}else if(phoneNumber.length > 20){
		alert(PHONE_NUMBER_EXCEEDS_LIMIT);
		return;
	}
	
	getPhoneContacts();
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
		if(contacts[i].phoneNumbers){
			for(var j=0;j<contacts[i].phoneNumbers.length;j++){
				phoneContactsArray[phoneContactsArrayCount] = contacts[i].phoneNumbers[j].value;
				phoneContactsArrayCount++;
			}	
		}
	}
	console.log(JSON.stringify(phoneContactsArray));
	navigator.geolocation.getCurrentPosition(getCurrentPositionSuccess, getCurrentPositionError);
}

function getCurrentPositionSuccess(position){
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	
	
	var url = BASE_URL + REGISTER_API + userName + "/" + phoneNumber + "/" + lng + "/" + lat + "/" + JSON.stringify(phoneContactsArray);
	
	
	$.getJSON(url,function(data){
		console.log(data.id);
		saveUserId(data.id);
	});
}

function getCurrentPositionError(){
	alert("Cant load location");
}

function saveUserId(id){
	userId = id;
	userName = "";
	phoneNumber = "";
	localStorage.setItem("UserID", id);
}

function getUserId(){
	userId = localStorage.getItem("UserID");
}
