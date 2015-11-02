clientaddin.factory('IcwsSessionService', function ($rootScope, $log, $interval, http) {
  isConnected = false;
  serverUrl = '';
  sessionId = null;
  csrfToken = null;
  messagePollInterval = null;

  function getConnection(){
    var baseUrl = ININ.Addins.IC.getIcwsBaseUrl();
    $log.debug("Getting ICWS connection " + baseUrl);

    ININ.Addins.IC.requestIcwsConnectionRequestSettings().then(function(connectionRequestSettings) {

       connect(baseUrl,connectionRequestSettings, function(){

             messagePollInterval = $interval(function(){
               //keep polling so that we can keep our connection alive.
               get('/messaging/messages');
             }, 5000);

     });

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

  function connect(url, connectData, onSuccess){
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

                                if(onSuccess){
                                  onSuccess();
                                }
                            }, function (data, status) {
                                $log.error("Unable to connect to ICWS session " + data )
                            });
  }

  function get(url, onSuccess, onFailure){
      http({
        method:'GET',
        url: serverUrl + '/icws/' + sessionId + url,
        headers:{
          'ININ-ICWS-CSRF-Token' : csrfToken
        },
        timeout:2000
      },function (data, status) {
          if(onSuccess){
            onSuccess(data,status);
          }

      },function (data, status) {
        if(onFailure){
          onFailure(data,status);
        }
      });
  }

  return{
    post:function(url, data, onSuccess, onFailure){
      var options = {
        method:'POST',
        url: serverUrl + '/icws/' + sessionId + url,
        headers:{
          'ININ-ICWS-CSRF-Token' : csrfToken
        },
        timeout:2000
      };

      if(data){
        options.data = data;
      }

      http(options,function (data, status) {
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
