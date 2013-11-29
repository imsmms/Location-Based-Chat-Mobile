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
	
	switch(envVariable){
	case 1:
		//For jasmine testing for now
		
		$("#pagePort").load("spec.html", function(){
		});
		//window.location = "spec.html";
		break;
	case 2:
		if(getUserId()){
			console.log("nearby");
			getPhoneContacts();
			//navigator.notification.loadingStart();
			isnearBy = true;
			//window.location = "nearByContactsMap.html";
		}else{
			$("#pagePort").load("registration.html", function(){
				$('body').css("background-image","none");
			});
			//window.location = "registration.html";
		}
		break;
	case 3://trial
		$("#pagePort").load("registration.html", function(){
			$('body').css("background-image","none");
		});
		//window.location = "registration.html";
	}
	
}
