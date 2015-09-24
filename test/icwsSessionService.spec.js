describe('IcwsSessionService', function() {
    beforeEach(function() { angular.mock.module('clientaddin'); });

    var httpMock =  function(data, onSuccess, onFailure){
        onSuccess({sessionId: '1234', csrfToken:'abcd'}, 201);
    };

    var deferred = null;

    beforeEach(function(){

        module(function($provide){
            $provide.value('http', httpMock);
        });

        inject(function($rootScope, _IcwsSessionService_, $q){
            ININ = {
                Addins:{
                    IC:{
                        getIcwsBaseUrl: function(){
                            return "http://url/";
                        },
                        requestIcwsConnectionRequestSettings: function(){
                            deferred = $q.defer();
                            return deferred.promise;
                        },
                        sessionInfo:
                        {
                            connected: true,
                            on: function(){}
                        }
                    }
                }
            }

            rootScope = $rootScope;
            q=$q;
            IcwsSessionService = _IcwsSessionService_;
        })
    });

    it("should connect on initialize", function(){
        spyOn(ININ.Addins.IC, "requestIcwsConnectionRequestSettings").and.callThrough();

        rootScope.$broadcast("initialize");
        deferred.resolve({});

        expect(ININ.Addins.IC.requestIcwsConnectionRequestSettings).toHaveBeenCalled();
    });

    it("should post data", function(){
        var postData = {foo:'bar'};
        IcwsSessionService.post("http://url", postData, function(data, status){
            expect(status).toEqual(201);
            expect(data.sessionId).toEqual("1234");
        }, function(){
            fail();
        })
    });
});
