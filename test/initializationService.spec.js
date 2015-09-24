describe('InitializationService', function() {
    beforeEach(function() { angular.mock.module('clientaddin'); });


    beforeEach(function(){
        windowMock = {
            isInitialized: true
        }

        module(function($provide){
            $provide.value('$window', windowMock);
        });

        inject(function($rootScope, _$interval_, _InitializationService_){
            rootScope = $rootScope;
            $interval = _$interval_;
            InitializationService = _InitializationService_;
        })
    });

    it("broadcast whe initialized is set", function(){
        spyOn(rootScope, '$broadcast').and.callThrough();

         $interval.flush(1001);
        expect(rootScope.$broadcast).toHaveBeenCalledWith("initialize", null);
    });

    it("broadcast whe initialized is set", function(){
        spyOn(rootScope, '$broadcast').and.callThrough();
        spyOn(windowMock, 'isInitialized').and.returnValue(false);

        $interval.flush(1001);
        expect(rootScope.$broadcast).not.toHaveBeenCalledWith("initialize", null);
    });
});
