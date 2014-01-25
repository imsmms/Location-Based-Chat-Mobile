/**
 * This file is responsible for testing registration logic
 */

describe("Registration",function(){
	describe("User registration validation",function(){
		it('should not validate empty user name or phone number', function() {
			expect(validateRegisterationInfo()).toBe(false);
			expect(validateRegisterationInfo("")).toBe(false);
			expect(validateRegisterationInfo("","")).toBe(false);
			expect(validateRegisterationInfo("Ibrahim","")).toBe(false);
			expect(validateRegisterationInfo("","012356437364")).toBe(false);
		});
		it('should not validate non valid phone number', function() {
			expect(validateRegisterationInfo("Ibrahim","012356437364732649823698324334")).toBe(false);
		});
		it('should validate valid user name and phone number', function() {
			expect(validateRegisterationInfo("Ibrahim","01235643736")).toBe(true);
		});
	});
	
	describe("Getting contacts",function(){
		it('should call getPhoneContactsSuccess callback', function() {
			runs(function() {
                spyOn(window, 'getPhoneContactsSuccess');
                getPhoneContacts();
			});
			waitsFor(function() {
                return (getPhoneContactsSuccess.calls.length > 0);
            }, 'getPhoneContactsSuccess should be called once', 500);

            runs(function() {
                expect(getPhoneContactsSuccess).toHaveBeenCalled();
            });
		});
	});
	
	describe("Getting user location",function(){
		it('should call getCurrentPositionSuccess callback', function() {
			runs(function() {
                spyOn(window, 'getCurrentPositionSuccess');
                getMyLocation();
			});
			waitsFor(function() {
                return (getCurrentPositionSuccess.calls.length > 0);
            }, 'getCurrentPositionSuccess should be called once', 5000);

            runs(function() {
                expect(getCurrentPositionSuccess).toHaveBeenCalled();
            });
		});
	});
	
	describe("Should be able to save and get valid user ID",function(){
		it('Save invalid User ID', function() {
			expect(saveUserId()).toBe(false);
			expect(saveUserId("")).toBe(false);
		});
		it('Save valid User ID', function() {
			expect(saveUserId("528fae96dce8b6940f000007")).toBe(true);
		});
		it('Get User ID', function() {
			expect(getUserId()).toBe(true);
		});
	});
});