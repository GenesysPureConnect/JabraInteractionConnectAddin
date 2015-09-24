describe('WebsocketService', function() {
    beforeEach(function() { angular.mock.module('clientaddin'); });

    beforeEach(function(){
        inject(function($rootScope, _WebsocketService_){
            rootScope = $rootScope;
            WebsocketService = _WebsocketService_;
        })
    });

    it("should return a websocket", function(){
        var uri = "ws://uri/";
        var webSocket = WebsocketService.create(uri);
        expect(webSocket.url).toEqual(uri);
    });
});
