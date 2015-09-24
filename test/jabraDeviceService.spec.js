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

    var   InteractionServiceMock = {
        answerAlertingCall: function(){

        },
        disconnectSelectedCall: function(){

        }
    };

    var   QueueServiceMock = {
        alertingInteraction:function(){
            return false;
        }
    };

    beforeEach(function(){
        module(function($provide){
            $provide.value('WebsocketService', WebsocketServiceMock);
            $provide.value('InteractionService', InteractionServiceMock);
            $provide.value('QueueService', QueueServiceMock);
        });

        inject(function($rootScope, _JabraDeviceService_){
            rootScope = $rootScope;
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

        it('should call get devices and get state', function(){
            spyOn(WebSocketMock, 'send').and.callThrough();
            WebSocketMock.onopen();

            expect(WebSocketMock.send).toHaveBeenCalledWith("GetState");
            expect(WebSocketMock.send).toHaveBeenCalledWith("GetDevices");
        });

        it('should show connected when closed', function(){
            WebSocketMock.onopen();
            WebSocketMock.onclose();
            expect(JabraDeviceService.isConnected()).toBeFalsy();
        });
    });
    describe("When receiving events", function(){
        beforeEach(function(){
            JabraDeviceService.connect();
        });

        it('should handle device add/remove messages', function(){
            var addedDevice = "Test Device";
            WebSocketMock.onmessage({data:"DeviceAdded " + addedDevice});

            expect(JabraDeviceService.devices().indexOf(addedDevice) > -1).toBeTruthy();

            WebSocketMock.onmessage({data:"DeviceRemoved FakeDevice" });
            expect(JabraDeviceService.devices().length).toEqual(1);

            WebSocketMock.onmessage({data:"DeviceRemoved " + addedDevice});

            expect(JabraDeviceService.devices().indexOf(addedDevice) == -1).toBeTruthy();
            expect(JabraDeviceService.devices().length).toEqual(0);
        });

        it('should set the active device', function(){
            var addedDevice = "Test Device";
            WebSocketMock.onmessage({data:"ActiveDevice " + addedDevice});

            expect(JabraDeviceService.devices().indexOf(addedDevice) > -1).toBeTruthy();
            expect(JabraDeviceService.activeDevice()).toEqual(addedDevice);

        });

        it('should answer an alerting call and respond with off hook', function(){
            spyOn(InteractionServiceMock, 'answerAlertingCall').and.callThrough();
            spyOn(WebSocketMock, 'send').and.callThrough();
            WebSocketMock.onmessage({data:"AcceptCall"});

            expect(InteractionServiceMock.answerAlertingCall).toHaveBeenCalled();
            expect(WebSocketMock.send).toHaveBeenCalledWith("OffHook");

        });

        it('should disconnect selected call and respond with on hook', function(){
            spyOn(InteractionServiceMock, 'disconnectSelectedCall').and.callThrough();
            spyOn(WebSocketMock, 'send').and.callThrough();
            WebSocketMock.onmessage({data:"EndCall"});

            expect(InteractionServiceMock.disconnectSelectedCall).toHaveBeenCalled();
            expect(WebSocketMock.send).toHaveBeenCalledWith("OnHook");

        });

    });

    describe('When connected interaction count changes', function(){
        it('should send offhook command if connected count is >0', function(){
            spyOn(WebSocketMock, 'send').and.callThrough();
            rootScope.$broadcast('ConnectedInteractionCount', 1);
            expect(WebSocketMock.send).toHaveBeenCalledWith("OffHook");
        });

        it('should send onhook command if connected count is = 0', function(){
            spyOn(WebSocketMock, 'send').and.callThrough();
            rootScope.$broadcast('ConnectedInteractionCount', 0);
            expect(WebSocketMock.send).toHaveBeenCalledWith("OnHook");
        });
    });

    describe('When a call is alerting', function(){
        it('should send the ring command', function(){
            spyOn(WebSocketMock, 'send').and.callThrough();
            rootScope.$broadcast('InteractionAlerting', 1);
            expect(WebSocketMock.send).toHaveBeenCalledWith("Ring");
        });
    });

    describe('When initialized', function(){
        it('should send the onhook command', function(){
            spyOn(WebSocketMock, 'send').and.callThrough();
            rootScope.$broadcast('initialize', 1);
            expect(WebSocketMock.send).toHaveBeenCalledWith("OnHook");
        });
    });
});
