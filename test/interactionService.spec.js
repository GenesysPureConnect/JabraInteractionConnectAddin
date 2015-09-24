describe('InteractionService', function() {
    beforeEach(function() { angular.mock.module('clientaddin'); });

    var InteractionService;

    var IcwsSessionServiceMock = {
        post: function(url, data){}
    };

    var QueueServiceMock = {
        alertingInteraction: function(){}
    };

    beforeEach(function(){

        ININ = {
            Addins:{
                IC:{
                    Interactions:{
                        selectedInteraction:{
                            interactionId: null
                        }
                    }
                }
            }
        }

        module(function($provide){
            $provide.value('QueueService', QueueServiceMock);
            $provide.value('IcwsSessionService', IcwsSessionServiceMock);
        });

        inject(function($rootScope, _InteractionService_){
            rootScope = $rootScope;
            InteractionService = _InteractionService_;
        })
    });

    describe("when calling disconnect selected call", function(){
        it('should do nothing if selected interaction id == null', function(){
            spyOn(IcwsSessionServiceMock, 'post').and.callThrough();

            InteractionService.disconnectSelectedCall();
            expect(IcwsSessionServiceMock.post).not.toHaveBeenCalled();

        })

        it('should call the icws disconnect on the selected call', function(){
            ININ.Addins.IC.Interactions.selectedInteraction.interactionId = 1234;

            spyOn(IcwsSessionServiceMock, 'post').and.callThrough();

            InteractionService.disconnectSelectedCall();
            expect(IcwsSessionServiceMock.post).toHaveBeenCalledWith('/interactions/1234/disconnect');

        })
    });

    describe("when calling answer alerting call", function(){
        it('should do nothing there are no alerting calls', function(){
            spyOn(QueueServiceMock, 'alertingInteraction').and.returnValue(null);
            spyOn(IcwsSessionServiceMock, 'post').and.callThrough();

            InteractionService.answerAlertingCall();
            expect(IcwsSessionServiceMock.post).not.toHaveBeenCalled();

        })

        it('should call the icws pickup on the alerting call', function(){
            spyOn(QueueServiceMock, 'alertingInteraction').and.returnValue(1234);
            spyOn(IcwsSessionServiceMock, 'post').and.callThrough();

            InteractionService.answerAlertingCall();
            expect(IcwsSessionServiceMock.post).toHaveBeenCalledWith('/interactions/1234/pickup');

        })
    });
});
