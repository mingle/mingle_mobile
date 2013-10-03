var sys = require('util'),
    rest = require('restler');

// create a service constructor for very easy API wrappers a la HTTParty...
Mingle = rest.service(function(u, p) {
  this.defaults.username = u;
  this.defaults.password = p;
}, {
  baseURL: 'http://mingle_url'
}, {
  show: function(id) {
    return this.get('/api/v2/projects/project_identifier/cards/' + id + ".xml");
  }
});

var client = new Mingle('username', 'password');

client.show(1).on('complete', function(data) {
  
  sys.p(data);
});

var express = require('express'),
    app = express();

app.use("/js", express.static("js"));
app.use("/css", express.static("css"));

app.get('/', function(req, res){
  res.sendfile("./index.html");
});

app.get(/^(.+)$/, function(req, res) { 
  res.sendfile('./' + req.params[0]); 
});

app.listen(9090);