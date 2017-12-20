//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    request = require('request');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.get('/', function (req, res) {
  res.render('index.html', { pageCountMessage : null});
});


app.get('/cdi', function (req, res){

    var options_cdi = {
	    url: 'https://www.waze.com/row-RoutingManager/routingRequest?from=x%3A2.28795+y%3A41.59321000000001&to=x%3A2.2038251+y%3A41.4431664&at=0&returnJSON=true&returnGeometries=true&returnInstructions=true&timeout=60000&nPaths=3&clientVersion=4.0.0&options=AVOID_TRAILS%3At%2CALLOW_UTURNS%3At',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
            'Referer': 'https://www.waze.com/es/livemap'
        }
    };

    request(options_cdi, function (error, response, body){

        var resp = [];

        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);

            for (var route in info.alternatives) {
                var _name = info.alternatives[route].response.routeName;
               var _time = Math.trunc(info.alternatives[route].response.totalRouteTime / 60);
                var _type = info.alternatives[route].response.routeType[0];

                resp.push({name: _name, time: _time, type: _type});
            }

            res.render('ride2work.html', { routes : resp, title: "GRANOLLERS - CDI", to: 'Caja de Ingenieros - Potosí, 22'});
        } else {
            res.render('ride2work.html', { title: "ERROR AL CONSULTA RUTAS"});
        }

    });
});

app.get('/uab', function (req, res) {

    var options_uab = {
	    url: 'https://www.waze.com/row-RoutingManager/routingRequest?from=x%3A2.28795+y%3A41.59321000000001&to=x%3A2.1025104+y%3A41.5028528&at=0&returnJSON=true&returnGeometries=true&returnInstructions=true&timeout=60000&nPaths=3&clientVersion=4.0.0&options=AVOID_TRAILS%3At%2CALLOW_UTURNS%3At',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
            'Referer': 'https://www.waze.com/es/livemap'
        }
    };


    request(options_uab, function (error, response, body){

        var resp = [];

        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);

            for (var route in info.alternatives) {
                var _name = info.alternatives[route].response.routeName;
               var _time = Math.trunc(info.alternatives[route].response.totalRouteTime / 60);
                var _type = info.alternatives[route].response.routeType[0];

                resp.push({name: _name, time: _time, type: _type});
            }

            res.render('ride2work.html', { routes : resp, title: "GRANOLLERS - UAB", to: 'Universitat Autònoma, Barcelona, Espanya'});
        } else {
            res.render('ride2work.html', { title: "ERROR AL CONSULTA RUTAS"});
        }

    });

});


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
