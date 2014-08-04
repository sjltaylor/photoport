Collections.Collection = Backbone.Model.extend({
  initialize: function (data) {
    var photos = data.photos || [];
    delete data.photos;
    this.photos = new Backbone.Collection(photos);
  }
});

Collections.Collection.all = new Backbone.Collection([], { model: Collections.Collection });
