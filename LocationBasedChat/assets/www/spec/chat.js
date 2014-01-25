describe("Send/Receive Message",function(){
	describe("Send Message",function(){
		beforeEach(function() {
		    socket.emit = function(value) {
		        	return;
			};
			spyOn(socket, 'emit');
		});
		it('should not send empty message', function() {
			sendMessage('');
			expect(socket.emit).not.toHaveBeenCalled();
		});
		it('should send a valid message', function() {
			sendMessage('test');
			expect(socket.emit).toHaveBeenCalled();
		});
		it('should append message to chat log', function() {
			sendMessage('test');
			expect(messageLog[messageLog.length-1].Message).toBe('test');
		});
	});
	describe("Receive Message",function(){
		it('should append message to chat log', function() {
			//simulate receiving a message
			//expect();
		});
	});
});