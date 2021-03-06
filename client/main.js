import "./templates/home.html"

Games = new Mongo.Collection("games");
CreateLobby = new Mongo.Collection("createlobby");
SearchLobby = new Mongo.Collection("searchlobby");

CreateLobbySchema = new SimpleSchema({
  game: {
    type: String,
    label: "Game",
    autoValue: function(){
      return elementText
    },
    autoform: {
      type: "hidden"
    }
  },
  console: {
    type: String,
    label: "Console",
    autoform: {
      type: "select",
      options: function () {
        return [
          {label: "Xbox 360", value: "Xbox 360"},
          {label: "PS3", value: "PS3"},
          {label: "Xbox 1", value: "Xbox 1"},
          {label: "PS4", value: "PS4"},
          {label: "PC: Steam", value: "PC: Steam"},
          {label: "PC: Origin", value: "PC: Origin"}
        ];
      }
    }
  },
  players: {
    type: String,
    label: "Players",
    autoform: {
      type: "select",
      options: function () {
        return [
          {label: "Two Player", value: 2},
          {label: "Three Player", value: 3},
          {label: "Four Player", value: 4},
        ];
      }
    }
  },
  mic: {
    type: String,
    label: "Mic",
    autoform: {
      afFieldInput: {
        type: "boolean-select"
      }
    }
  },
  note: {
    type: String,
    label: "Note",
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
  },
  profile: {
    type: String,
    label: "Profile",
    autoValue: function(){
      return this.userId
    },
    autoform: {
      type: "hidden"
    }
  }
});

SearchLobbySchema = new SimpleSchema({
  game: {
    type: String,
    label: "Game",
    autoValue: function(){
      return elementText
    },
    autoform: {
      type: "hidden"
    }
  },
  console: {
    type: String,
    label: "Console",
    autoform: {
      type: "select",
      options: function () {
        return [
          {label: "Xbox 360", value: "Xbox 360"},
          {label: "PS3", value: "PS3"},
          {label: "Xbox 1", value: "Xbox 1"},
          {label: "PS4", value: "PS4"},
          {label: "PC: Steam", value: "PC: Steam"},
          {label: "PC: Origin", value: "PC: Origin"}
        ];
      }
    }
  },
  players: {
    type: String,
    label: "Players",
    autoform: {
      type: "select",
      options: function () {
        return [
          {label: "Two Player", value: 2},
          {label: "Three Player", value: 3},
          {label: "Four Player", value: 4},
        ];
      }
    }
  },
  mic: {
    type: String,
    label: "Mic",
    autoform: {
      afFieldInput: {
        type: "boolean-select"
      }
    }
  },
  profile: {
    type: String,
    label: "Profile",
    autoValue: function(){
      return this.userId
    },
    autoform: {
      type: "hidden"
    }
  },
  createdAt: {
    type: Date,
    label: "Create At",
    autoValue: function() {
      return new Date()
    },
    autoform: {
      type: "hidden"
    }
  }
});

CreateLobby.attachSchema( CreateLobbySchema );
SearchLobby.attachSchema( SearchLobbySchema );

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
Meteor.subscribe("createlobby");
Meteor.subscribe("searchlobby");

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

Template.landing.events({
  'click .login-toggle': ()=> {
    Session.set('nav-toggle', 'open');
    console.log("hello");
  },
  'click .logout': ()=> {
    Meteor.logout();
  }
});

Template.LoginModal.events({
  'click .close-login': ()=> {
    Session.set('nav-toggle', '');
  }
});


Template.joinLobby.helpers({
  lobbyTabs: function(){

    var game1 = SearchLobby.findOne(
      {profile: Meteor.userId()},
      {game: 1,_id: 0}
    ).game;

    var console1 = SearchLobby.findOne(
      {profile: Meteor.userId()},
      {conosle: 1,_id: 0}
    ).console;

    var players1 = SearchLobby.findOne(
      {profile: Meteor.userId()},
      {players: 1,_id: 0}
    ).players;

    var mic1 = SearchLobby.findOne(
      {profile: Meteor.userId()},
      {mic: 1,_id: 0}
    ).mic;
    return CreateLobby.find({game: game1, console: console1, players: players1, mic: mic1});
  }
});
