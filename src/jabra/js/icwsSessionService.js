clientaddin.factory('IcwsSessionService', function ($rootScope, $log, $http, http) {
  isConnected = false;
  serverUrl = '';

  function getConnection(){
    var baseUrl = ININ.Addins.IC.getIcwsBaseUrl();
    ININ.Addins.IC.requestIcwsConnectionRequestSettings().then(function(connectionRequestSettings) {
       // POST icws/connection
       connect(baseUrl,connectionRequestSettings);

    });
  }

  $rootScope.$on('initialize', function (event, data) {
      if(ININ.Addins.IC.sessionInfo.connected == true){
          getConnection();
      }

      ININ.Addins.IC.sessionInfo.on("connected", function(sessionInfo) {
          getConnection();
      });
  });

  function connect(url, connectData){
    serverUrl = url;
    $log.debug("Getting ICWS session from " + serverUrl);
    var requestData = {
        method: 'POST',
        withCredentials: true,
        url: serverUrl + "/icws/connection?include=version,features",
        headers: {
            'Accept-Language': 'en-us'
        },
        timeout: 2000,
        data: connectData
    };
    http(requestData, function (data, status) {
                                $log.debug("got icws session");
                                sessionId = data.sessionId;
                                csrfToken = data.csrfToken;
                            }, function (data, status) {
                                $log.error("Unable to connect to ICWS session " + data )
                            });
  }

  return{
    post:function(url, data, onSuccess, onFailure){
      http({
        method:'POST',
        url: serverUrl + '/icws/' + sessionId + url,
        headers:{
          'ININ-ICWS-CSRF-Token' : csrfToken
        },
        timeout:2000,
        data: data
      },function (data, status) {
          if(onSuccess){
            onSuccess(data,status);
          }

      },function (data, status) {
        if(onFailure){
          onFailure(data,status);
        }
      });

    },
    isConnected: function(){
      return isConnected;
    }
  };
});
