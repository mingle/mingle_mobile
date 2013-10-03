var rest = require('restler'),
 xml2json = require('xml2json');

var config = require('../config');

Mingle = rest.service(function(u, p) {
  this.defaults.username = u;
  this.defaults.password = p;
}, {
  baseURL: config.url
}, {
  show: function(id) {
    return this.get('/api/v2/projects/'+ config.projectName +'/cards/' + id + ".xml");
  },
  move: function(id, status){
    var data = { 'card[name]': "New card name goes here", 
                 'card[properties][][name]': 'Status',
                 'card[properties][][value]': status };
    return this.put('/api/v2/projects/' + config.projectName + '/cards/' + id + ".xml", {data: data});
    
  }
});

var client = new Mingle(config.username, config.password);

var statuses = ["In Analysis", "ready for development", "In Dev", "Testing","Done"];

exports.moveCard = function(req, res){
  var cardNumber = req.params.card_number;
  var moveTo = statuses[req.params.status];
  console.log(moveTo);
  client.move(cardNumber, moveTo).on('complete', function(data, response) {
    console.log(response);
    res.render( 'move', { title: "card moved", statusCode: response.statusCode } );
  });
};