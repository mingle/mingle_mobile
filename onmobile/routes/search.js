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
    if(cardDetails.card){
      var title = cardDetails.card.name[0];
      var description = cardDetails.card.description[0].trim();

      res.render('search', { title: title + "( #" + cardNumber + " )", description: description, card_number: cardNumber });
    }
  });
};

