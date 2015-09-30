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
  
});
