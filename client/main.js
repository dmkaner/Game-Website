Games = new Mongo.Collection("games");

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

Meteor.subscribe("games");

Meteor.methods({
  updateScore: function (playerId) {
    check(playerId, String);
    Games.update(playerId, { $inc: { score: 5 }});
  }
});

  Template.leaderboard.helpers({
    inputAttributes: function () {
      return { 'class': 'easy-search-input', 'placeholder': 'Start searching...' };
    },
    players: function () {
      return Games.find({}, { sort: { score: -1, name: 1 } });
    },
    selectedName: function () {
      var game = GamesIndex.config.mongoCollection.findOne({ __originalId: Session.get("selectedPlayer") });
      return game && game.title;
    },
    index: function () {
      return GamesIndex;
    },
    resultsCount: function () {
      return GamesIndex.getComponentDict().get('count');
    },
    showMore: function () {
      return false;
    },
    renderTmpl: () => Template.renderTemplate
  });

  Template.leaderboard.events({
    'click .inc': function () {
      Meteor.call('updateScore', Session.get("selectedPlayer"));
    },
    'change .category-filter': function (e) {
      GamesIndex.getComponentMethods()
        .addProps('categoryFilter', $(e.target).val())
      ;
    }
  });

  Tracker.autorun(() => {
    console.log(GamesIndex.search('Barack', { limit: 20 }).fetch());
  });

  Template.home.helpers({
    gameTabs: function(){
        return Games.find();
    }
  });
