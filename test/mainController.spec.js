describe('mainController', function () {
    var alertController, scope, rootScope, stationServiceMock, interactionServiceMock, $timeout;
    beforeEach(module('clientaddin'));

    beforeEach(inject(function ($controller, $rootScope) {
        rootScope = $rootScope;
        scope = $rootScope.$new();

        JabraDeviceServiceMock = {
            isConnecting:function(){return false},
            isConnected:function(){return true},
            connect:function(){},
            devices:function(){ return ["A","B"]},
            activeDevice:function(){ return "ACTIVEDEVICE"}
        }
        mainController = $controller("MainController", {$scope: scope, $rootScope: rootScope, JabraDeviceService: JabraDeviceServiceMock});

    }));


    it("should show connected", function(){
        scope.$digest();
        expect(scope.isConnected).toBe(JabraDeviceServiceMock.isConnected());
    });

    it("should show connecting", function(){
        scope.$digest();
        expect(scope.isConnecting).toBe(JabraDeviceServiceMock.isConnecting());
    });

    it('should pass on connect to jabra service', function(){
        spyOn(JabraDeviceServiceMock, "connect").and.callThrough();
        scope.connect();
        expect(JabraDeviceServiceMock.connect).toHaveBeenCalled();
    });
});
