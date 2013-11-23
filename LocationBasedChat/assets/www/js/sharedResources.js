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
var userId;

/**
 * Messages
 */
var EMPTY_USERNAME_PASSWORD = "Please fill the required fields!!";
var PHONE_NUMBER_EXCEEDS_LIMIT = "Phone number can't be that length, please check phone number field!!";
var INVALID_USER_ID = "Sorry can't save your user id, invalid user id, please contact app administrator!!";

/**
 * URLs
 */

var BASE_URL = "http://location-based-chat.herokuapp.com";
var NEAR_CONTACTS_API = "/near/:";
var REGISTER_API = "/register/:";