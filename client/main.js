Games = new Mongo.Collection("games");
Lobby = new Mongo.Collection("lobby");

LobbySchema = new SimpleSchema({
  game: {
    type: String,
    label: "Game",
    autoValue: function(){
      return "dylan";
    },
    autoform: {
      type: "hidden"
    }
  },
  console: {
    type: String,
    label: "Console"
  },
  players: {
    type: Number,
    label: "Players"
  },
  mic: {
    type: Boolean,
    label: "Mic"
  },
  note: {
    type: String,
    label: "Note"
  },
  gamertag: {
    type: String,
    label: "Gamertag"
  },
  createdAt: {
    type: Date,
    label: "Created At",
    autoValue: function(){
      return new Date()
    },
    autoform: {
      type: "hidden"
    }
  }
});

Lobby.attachSchema( LobbySchema );

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
Meteor.subscribe("lobby");

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

AutoForm.debug();
