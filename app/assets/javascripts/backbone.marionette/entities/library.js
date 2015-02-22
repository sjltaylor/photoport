//= require backbone.marionette/entities/collection

Collections.Library = Backbone.Model.extend({
  initialize: function () {
    this.__new__ = new Collections.Collection({
      show: this.get('new')
    });

    this.resetCollections([]);

    this.on('change:new', function () {
      this.__new__.set({
        show: this.get('new')
      });
    });
  },
  resetCollections: function (collections) {
    this.collections().reset(collections.concat([this.__new__]));
  },
  collections: function () {
    return Collections.Collection.all;
  },
  new: function () {
    return this.__new__;
  }
});
