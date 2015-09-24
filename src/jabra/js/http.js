clientaddin.factory('http', function ($log) {

  return function(data, onSuccess, onError){
    $log.debug('impl')
    var req = new XMLHttpRequest();

    req.onerror = function(e){
      $log.error("http error")
      $log.error(e);

      if(onError){
        responseData = JSON.parse(req.responseText);
        onSuccess(responseData, req.status);
      }
    }
    req.onload = function(e) {
      $log.debug("onload")

      if(onSuccess){
        responseData = JSON.parse(req.responseText);
        onSuccess(responseData, req.status);
      }
    };

    $log.debug(data)
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
