var rest = require('restler'),
 xml2json = require('xml2json');

var config = require('../config');

// create a service constructor for very easy API wrappers a la HTTParty...
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
    var data = { 'card[properties][][name]': 'status',
                 'card[properties][][value]': status };
    rest.post('/api/v2/projects/' + config.projectName + '/cards/' + id + ".xml", {data: data}).on('complete', function(data, response) {
      if(response.statusCode == 200 || response.statusCode == 201){
        return true;
      }
    });
    
  }
});

var client = new Mingle(config.username, config.password);

exports.results = function(req, res){
  var cardNumber = req.body.card_number;
  client.show(cardNumber).on('complete', function(cardDetails) {
    if(cardDetails == undefined){
      res.render("Oops could not find your card");
      return true;
    }
    var title = cardDetails.card.name[0];
    var description = cardDetails.card.description[0].trim();
    res.render('search', { title: title + "( #" + cardNumber + " )", description: description, card_number: cardNumber });
  });
};

var statuses = ["In Analysis", "ready for development", "In Dev", "Testing","Done"];

exports.moveCard = function(req, res){
  var cardNumber = req.params.card_number;
  var moveTo = req.params.status;
  console.log(moveTo);
  console.log(cardNumber);
  client.move(cardNumber, moveTo).on('complete', function(err, response){
    if(response) {
      res.render("card moved");
    }
  });
};