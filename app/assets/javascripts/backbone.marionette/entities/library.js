//= require backbone.marionette/entities/collection

Collections.Library = Backbone.Model.extend({
  initialize: function () {
    this.__new__ = new Collections.Collection({
      show: this.get('new')
    });

    this.collections().add(this.__new__);

    this.on('change:new', function () {
      this.__new__.set({
        show: this.get('new')
      });
    });
  },
  collections: function () {
    return Collections.Collection.all;
  },
  new: function () {
    return this.__new__;
  },
  open: function (collection) {
    var open = this.opened;
    if (open) {
      open.set('open', false);
    }
    collection.set('open', true);
    this.opened = collection;
  }
});
