/**
 * Contact Model
 */

var Contact = {
	contactName : "",
	contactPhone : "",
	contactMail : "",
	contactPhoto : "",
	contactLocation : {},
	setContactName : function(name){
		this.contactName = name;
	},
	setContactPhone : function(phone){
		this.contactPhone = phone;
	},
	setContactMail : function(mail){
		this.contactMail = mail;
	},
	setContactPhoto : function(photo){
		this.contactPhoto = photo;
	},
	getContactName : function(){
		return this.contactName;
	},
	getContactPhone : function(){
		return this.contactPhone;
	},
	getContactMail : function(){
		return this.contactMail;
	},
	getContactPhoto : function(){
		return this.contactPhoto;
	}
};