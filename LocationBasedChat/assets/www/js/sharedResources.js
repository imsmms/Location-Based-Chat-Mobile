/**
 * sharedResources.js file is the file contains all the shared resources
 */


/**
 * Global Variables
 */
var phoneContactsArray = [];
var locObj;
var userName;
var phoneNumber;
var phoneContacts = [];
var appContacts = [];
var nearByContacts = [];
var namePhoneMapping = {};
var isnearBy = false;
var chatID;
var newChatID;

var onlineUsers = [];
//Stubbed user ID
var userId;
var ChatGroups = { };
var socket;

var windowHight = parseInt($(window).height());
var isInNearBy = false;
var isInChatList = false;

//Back button handling
var pageHistory = [];
//Markers
var markersArray = [];
//chat history
var chatHistory = {};
var chatHistoryIndex = "";

var groupChatIDs = [];
var groupChatCounter = 0;
var groupChatFlag = false;

var groupName = "";

//Notification Object
var notifyMeObject = {
		"near-by" : 0,
		"add-to-group" : 1,
		"remove-member" : 2,
		"new-member": 3,
		"remove-member": 4,
		"remove-from-group": 5,
		"on-line" : 6,
		"off-line" : 7
}

/**
 * Contact Model
 */

var Contact = {
	contactName : "",
	contactPhones : [],
	contactPhone : "",
	contactMail : "",
	contactPhoto : "",
	contactLocation : {}
};

var GroupChats = [];

function Group() {
	this.groupName = "";
	this.groupID = "";
	this.groupMembers = [];
	this.isAdmin = false;
}

/**
 * Defining the environment 
 * 1->testing
 * 2->Development
 * 3->trial
 */
var envVariable = 2;

/**
 * Messages
 */
var EMPTY_USERNAME_PASSWORD = "Please fill the required fields!!";
var PHONE_NUMBER_EXCEEDS_LIMIT = "Phone number can't be that length, please check phone number field!!";
var INVALID_USER_ID = "Sorry can't save your user id, invalid user id, please contact app administrator!!";
var Location_Error = "Sorry can't load your location!!";

/**
 * URLs
 */

var BASE_URL = "http://location-based-chat-stag.herokuapp.com";
var NEAR_CONTACTS_API = "/near/";
var REGISTER_API = "/register/";