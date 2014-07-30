// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Redis = new Meteor.RedisCollection('redis');
Neo4j = new Meteor.Neo4jCollection('neo4j');
Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("############### insert players! ");
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
    if (Neo4j) {
      var names = "george";
      console.log("inside Neo4j");
      var nodes = Neo4j.getIndexedNodes("leaderboard", function(err, nodes) {
        console.log("leaderboard nodes: " + nodes);  
      });
      var nodes = Neo4j.getIndexedNodes("leaderboard2", function(err, nodes) {
        console.log("leaderboard nodes: " + nodes);  
      });
      console.log(nodes);

      console.log("inside SERVER");
      console.log(names);

      //  Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
