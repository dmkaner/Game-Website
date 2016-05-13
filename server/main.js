Games = new Mongo.Collection("games");
Lobby = new Mongo.Collection("lobby");

Games.allow({
  'insert': function (userId,doc) {
    return true;
  }
});

GamesIndex = new EasySearch.Index({
  engine: new EasySearch.MongoDB({
    sort: function () {
      return { score: -1 };
    },
    selector: function (searchObject, options, aggregation) {
      let selector = this.defaultConfiguration().selector(searchObject, options, aggregation),
        categoryFilter = options.search.props.categoryFilter;

      if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
        selector.category = categoryFilter;
      }

      return selector;
    }
  }),
  collection: Games,
  fields: ['title'],
  defaultSearchOptions: {
    limit: 8
  },
  permission: () => {
    //console.log(Meteor.userId());

    return true;
  }
});

Meteor.publish("games", function(){
  return Games.find();
});

// Meteor.startup(function () {
//   Games.insert({
//     title: "Fallout 4",
//     background: "/images/gameArt/fallout4.jpg"
//   });
//   Games.insert({
//     title: "Skyrim",
//     background: "/images/skyrim.jpg"
//   });
//   Games.insert({
//     title: "Minecraft",
//     background: "/images/minecraft.jpg"
//   });
//   Games.insert({
//     title: "Doom",
//     background: "/images/doom.jpg"
//   });
//   Games.insert({
//     title: "Battlefield 1",
//     background: "/images/battefield1.jpg"
//   });
// });

// Meteor.startup(function(){
//     db.games.insert({
//       title: "Minecraft",
//       background: "/images/minecraft.jpg",
//       code: "<div id=\"gameBackround\" class=\"col-lg-2 popular-games view view-first\" style=\"background-image:url( /images/gameArt/minecraft.jpg )\"> <div class=\"mask\"> <h2>Minecraft</h2> <p>Amount of groups playing this title now: 11,075</p> <a href=\"#\" class=\"info\">Join Lobby</a> </div> </div> <style>  </style>"
//     })
// });
