/**
 * This file is responsible for testing nearByContactsMap logic
 */

describe("NearBy Contacts",function(){
	describe("Getting user location",function(){
		it('should call getUserLocationSuccess callback', function() {
			runs(function() {
                spyOn(window, 'getUserLocationSuccess');
                getUserLocation();
			});
			waitsFor(function() {
                return (getUserLocationSuccess.calls.length > 0);
            }, 'getUserLocationSuccess should be called once', 5000);

            runs(function() {
                expect(getUserLocationSuccess).toHaveBeenCalled();
            });
		});
	});
	describe("Getting near by contacts",function(){
		it('should call getNearByContactsSuccess callback', function() {
			runs(function() {
				var myloc = {ob:30,pb:31};
                spyOn(window, 'getNearByContactsSuccess');
                getNearByContacts(myloc);
			});
			waitsFor(function() {
                return (getNearByContactsSuccess.calls.length > 0);
            }, 'getNearByContactsSuccess should be called once', 5000);

            runs(function() {
                expect(getNearByContactsSuccess).toHaveBeenCalled();
            });
		});
	});
});