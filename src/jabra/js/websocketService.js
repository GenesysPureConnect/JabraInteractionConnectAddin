clientaddin.factory('WebsocketService', function () {
        return {
            create: function (uri) {
                return new WebSocket(uri);
            }
        };
    });
