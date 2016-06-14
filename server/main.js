Games = new Mongo.Collection("games");
CreateLobby = new Mongo.Collection("createlobby");
SearchLobby = new Mongo.Collection("searchlobby");

CreateLobby.allow({
  'insert': function (userId,doc) {
    return true;
  }
});

Games.allow({
  'insert': function (userId,doc) {
    return true;
  }
});

SearchLobby.allow({
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

Meteor.publish("createlobby", function(){
  return CreateLobby.find();
});

Meteor.publish("searchlobby", function(){
  return SearchLobby.find();
});

SearchLobby.before.insert(function(userId, doc) {
    SearchLobby.remove({profile:Meteor.userId()});
});
