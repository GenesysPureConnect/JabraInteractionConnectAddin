describe('jabraDeviceService', function() {


  beforeEach(function() { angular.mock.module('clientaddin'); });

  var JabraDeviceService;

  var WebSocketMock = {
    send: function(data){}
  };

  var   WebsocketServiceMock = {
    create: function(url){
      return WebSocketMock;
    }
  };
  beforeEach(function(){
    module(function($provide){
      $provide.value('WebsocketService', WebsocketServiceMock);
    });

    inject(function($rootScope, _JabraDeviceService_){
      JabraDeviceService = _JabraDeviceService_;
    })
  });

  beforeEach(function(){
    var realWS= WebSocket;

    WSSpy = spyOn(window, "WebSocket").and.callFake(function(url,protocols){
      return new realWS(url,protocols);
    });
  });

  describe("when connecting", function(){
    it('should connect to web socket', function(){
      spyOn(WebsocketServiceMock, 'create').and.callThrough();

      JabraDeviceService.connect();
      expect(WebsocketServiceMock.create).toHaveBeenCalledWith("ws://localhost:8080");

      expect(JabraDeviceService.isConnecting()).toEqual(false);
    })
  });

  describe("After connected", function(){
    beforeEach(function(){
      JabraDeviceService.connect();
    });

    it('should show connected', function(){
      WebSocketMock.onopen();
      expect(JabraDeviceService.isConnected()).toBeTruthy();
    });
  });
  /*
  it('says hello world!', function () {
  var realWS= WebSocket;
  var sendSpy = spyOn(WebSocket.prototype, "send").and.callFake(function(outMsg){
  if(outMsg == "outgoing message"){
  this.onmessage("incoming mocked message goes here");
}
});
// var messageSpy = spyOn(WebSocket.prototype, "onmessage");//.and.returnValue("mock message goes here");
var WSSpy = spyOn(window, "WebSocket").and.callFake(function(url,protocols){
return new realWS(url,protocols);
});
var onmessageCallbackSpy = jasmine.createSpy('onmessageCallback');

// Your code
// (function init(url, onmessageCallbackSpy){
var ws = new WebSocket("ws://some/where");
ws.onmessage = onmessageCallbackSpy;
// code that results with receiving a message
// or mocked send, that calls `.onmessage` immediately
ws.send("outgoing message");
// })();

expect(WSSpy).toHaveBeenCalledWith("ws://some/where");
expect(onmessageCallbackSpy).toHaveBeenCalledWith("mock message goes here");
done();
});

*/
});
