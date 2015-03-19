Collections.Collection = Backbone.Model.extend({
  initialize: function (data) {
    var photos = data.photos || [];
    delete data.photos;
    this.photos = new Backbone.Collection(photos, {
      model: Collections.Photo
    });
  }
});

Collections.Collection.all = new Backbone.Collection([], {
  model: Collections.Collection,
  comparator: function (collection) {
    if (collection.isNew()) return 1;
    if (collection.get('editing')) return -1;
    return 0;
  }
});

Collections.Collection.all.on('change:editing', function () {
  Collections.Collection.all.sort();
});
