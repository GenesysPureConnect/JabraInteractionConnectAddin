describe('http', function() {
    beforeEach(function() { angular.mock.module('clientaddin'); });


    beforeEach(function(){
        inject(function($rootScope, _http_){
            http = _http_;
        })
    });

    var xhrMock = {
        open: function(method, url, async){},
        withCredentials: false,
        timeout: 0,
        setRequestHeader: function(key, value){},
        send:function (data){}
    }

    it("should call on success", function(){
        spyOn(window, 'XMLHttpRequest').and.returnValue(xhrMock);
        spyOn(xhrMock, 'setRequestHeader').and.callThrough();

        var data =
        {
            method: "GET",
            url: "http://www.google.com",
            headers:{
                "BAR": "FOO"
            }
        }
        http(data, function(data, status){
            expect(data.foo).toEqual("bar");
            expect(status).toEqual(200);
        }, function (data, status){
            fail();
        })

        xhrMock.responseText = JSON.stringify({foo:'bar'});
        xhrMock.status = 200;
        xhrMock.onload({});

        expect(xhrMock.setRequestHeader).toHaveBeenCalledWith("BAR","FOO")
    });

    it("should call error", function(){
        spyOn(window, 'XMLHttpRequest').and.returnValue(xhrMock);

        var data =
        {
            method: "GET",
            url: "http://www.google.com",
            headers:{
                "BAR": "FOO"
            }
        }
        http(data, function(data, status){
            fail();
        }, function (data, status){
            expect(data.foo).toEqual("bar");
            expect(status).toEqual(400);
        })

        xhrMock.responseText = JSON.stringify({foo:'bar'});
        xhrMock.status = 400;
        xhrMock.onerror({});
    });

});
