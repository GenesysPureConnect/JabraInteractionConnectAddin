var request = require('request')
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var url = require("url");

var config = require('./development_config.json');

module.exports = function(){

    return function(req, res, next) {
        var hostname = req.headers.host.split(":")[0];
        var pathname = url.parse(req.url).pathname;
        var cic_server = '';

        res.oldWriteHead = res.writeHead;
        res.writeHead = function(statusCode, headers) {
            var setCookie = res.getHeader('set-cookie');

            if(setCookie != null){
                var newSetCookies = [];

                for(var x=0; x< setCookie.length; x++){
                    newSetCookies.push(setCookie[x].replace("Path=", "Path=/api/"+ cic_server ));
                }
                res.setHeader('set-cookie', newSetCookies);
            }

            res.oldWriteHead(statusCode, headers);
        }

        if(pathname.indexOf('/api') == 0){
            var pattern = /\/api\/([^\/]*)\/(.*)/;
            var icws_path = req.url.match(pattern)[2];
            cic_server = req.url.match(pattern)[1];

            req.headers['ININ-ICWS-Original-URL'] = 'http://localhost:' + config.port + req.url;

            req.url = icws_path;

            proxy.web(req, res, { target: 'http://'+ cic_server +':8018' });
        }
        else{
            //anything else should get proxied to the web client
            proxy.web(req, res, { target: config.connecturl });
            //next();
        }
    }
}
