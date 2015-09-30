clientaddin.factory('http', function ($log) {

  return function(data, onSuccess, onError){
    var req = new XMLHttpRequest();

    req.onerror = function(e){
      $log.error("http error")
      $log.error(e);

      if(onError){
        responseData = JSON.parse(req.responseText);
        onError(responseData, req.status);
      }
    }
    req.onload = function(e) {
      if(onSuccess){
        try{
          responseData = JSON.parse(req.responseText);
          onSuccess(responseData, req.status);
        }
        catch(err){
          $log.debug("Unable to parse: " + req.responseText);
          onSuccess({}, req.status);
        }
      }
    };

    req.open(data.method, data.url, true)

    req.withCredentials = true;
    req.timeout = data.timeout || 2000;
    req.setRequestHeader('Accept', 'application/vnd.inin.icws+JSON');
    req.setRequestHeader('Content-Type', 'application/vnd.inin.icws+JSON;charset=utf-8');
    Object.keys(data.headers).forEach(function(key){
      req.setRequestHeader(key, data.headers[key]);
    });

    req.send(JSON.stringify(data.data));
  }
});
