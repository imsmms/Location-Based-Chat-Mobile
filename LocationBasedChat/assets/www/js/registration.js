/**
 * registration.js is the controller responsible for handling all the 
 * logic related to the registration process
 */

function initializeRegisteration(){
	var regheight = parseInt($("#wrap").height());
	var top = (parseInt(window.screen.height)/2) - (regheight/2);
	$("#wrap").css("top",top);
}

/**
 * registerUser is the function that initiates the registration process
 */
function registerUser(){
	userName = $("#userNameID").val();//"Ibrahim";
	phoneNumber = $("#userPhoneNumber").val();//"01026357328";

	validateRegisterationInfo(userName,phoneNumber);

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
				phoneContactsArray[phoneContactsArrayCount] = contacts[i].phoneNumbers[j].value;
				//phoneContacts[i].contactPhones[j] = contacts[i].phoneNumbers[j].value;
				namePhoneMapping[contacts[i].phoneNumbers[j].value] = contacts[i].displayName;
				phoneContactsArrayCount++;
			}	
		}
	}
	console.log(JSON.stringify(phoneContactsArray));
	if(isnearBy){
		//window.location = "nearByContactsMap.html";
		$("#pagePort").load("nearByContactsMap.html", function(){
			$('body').css("background-image","none");
			$('#pagePort').trigger("create");
		});
		return;
	}
	console.log("hello geo");
	getMyLocation();
}

function getMyLocation(){
	navigator.geolocation.getCurrentPosition(getCurrentPositionSuccess, getCurrentPositionError);
}

function getCurrentPositionSuccess(position){
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;


	var url = BASE_URL + REGISTER_API + userName + "/" + phoneNumber + "/" + lng + "/" + lat + "/" + JSON.stringify(phoneContactsArray);

	console.log(url);
	$.getJSON(url,function(data){
		console.log(data.id);
		saveUserId(data.id);
	}).fail(function() {
		console.log( "error" );
	});
}

function getCurrentPositionError(){
	alert("Cant load location");
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
			$('body').css("background-image","none");
			$('#pagePort').trigger("create");
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
