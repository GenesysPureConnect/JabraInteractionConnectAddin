describe('QueueService', function() {

    beforeEach(function() { angular.mock.module('clientaddin'); });

    var QueueService;
    var interactionListMock= {

        size: 100
    }

    addedCallback = null;
    changedCallback = null;
    removedCallback = null;

    beforeEach(function(){
        callbacks = {};
        queueMock = {
            on: function(event, handler){
                if(event == "interactionAdded"){
                    addedCallback = handler;
                } else if(event == "interactionChanged"){
                    changedCallback = handler;
                }else if(event == "interactionRemoved"){
                    removedCallback = handler;
                }
            },
            subscribe: function(){},
            interactions: interactionListMock
        };


        ININ = {
            Addins:{
                IC:{
                    Interactions:{
                        attributeNames:{
                            state: "Eic_State",
                            interactionType: "TYPE"

                        },
                        stateAttributeValues:{
                            alerting: "ALERTING",
                            offering: "OFFERING"
                        }
                    },
                    Queues:{
                        Queue: function(){
                            return queueMock;
                        },
                        queueTypes:{
                            user:"user"
                        }
                    },
                    sessionInfo:{
                        connected: true,
                        userId:"userid",
                        on: function(){}
                    }
                }
            }
        }


        inject(function($rootScope, _QueueService_){
            rootScope = $rootScope;
            QueueService = _QueueService_;
        })
    });

    describe("on initialize", function(){
        it('should start watches', function(){
            spyOn(queueMock, 'subscribe').and.callThrough();
            spyOn(queueMock, 'on').and.callThrough();

            rootScope.$broadcast('initialize');
            expect(queueMock.subscribe).toHaveBeenCalled();
            expect(queueMock.on.calls.count()).toBe(3);

        })

    });

    describe("public methods", function(){
        it('should return interaction count', function(){
            rootScope.$broadcast('initialize');

            spyOn(queueMock, 'interactions').and.returnValue(interactionListMock);

            expect(QueueService.getInteractionCount()).toEqual(0);

        })

        it('should return interaction count', function(){
            rootScope.$broadcast('initialize');
            expect(QueueService.getInteractions()).toEqual({});
        })

    });

    describe("For Queue events", function(){
        beforeEach(function(){
            rootScope.$broadcast('initialize');
        })

        it('should alert on alerting interactions', function(){
            spyOn(rootScope, '$broadcast').and.callThrough();


            var addedInteraction = {
                interactionId : 1234,
                getAttribute: function(){
                    return ININ.Addins.IC.Interactions.stateAttributeValues.offering;
                }
            }

            addedCallback(addedInteraction);

            expect(rootScope.$broadcast).toHaveBeenCalledWith("InteractionAlerting", null);
            expect(QueueService.alertingInteraction()).toEqual('1234');
        })

        it('should broadcast interaction count on non alerting interactions', function(){
            spyOn(rootScope, '$broadcast').and.callThrough();


            var addedInteraction = {
                getAttribute: function(key){
                    if(key == ININ.Addins.IC.Interactions.attributeNames.state){
                        return "CONNECTED"
                    }
                    return "";
                }
            }

            addedCallback(addedInteraction);

            expect(rootScope.$broadcast).not.toHaveBeenCalledWith("InteractionAlerting", null);
            expect(rootScope.$broadcast).toHaveBeenCalledWith("ConnectedInteractionCount", 1);
            expect(QueueService.getInteractionCount()).toEqual(1);
            expect(QueueService.alertingInteraction()).toEqual(null);
        })

        it('should broadcast interaction count on changed interactions', function(){
            spyOn(rootScope, '$broadcast').and.callThrough();


            var addedInteraction = {
                interactionId: 1234,
                getAttribute: function(){
                    return "";
                }
            }

            changedCallback(addedInteraction);
            expect(QueueService.getInteractionCount()).toEqual(1);
            expect(rootScope.$broadcast).toHaveBeenCalledWith("ConnectedInteractionCount", 1);
        })

        it('should broadcast interaction count on removed interactions', function(){
            spyOn(rootScope, '$broadcast').and.callThrough();


            var removedInteraction = {
                interactionId: 1234
            }

            removedCallback(removedInteraction);
            expect(rootScope.$broadcast).toHaveBeenCalledWith("ConnectedInteractionCount", 0);
            expect(QueueService.getInteractionCount()).toEqual(0);
        })
    });

});
