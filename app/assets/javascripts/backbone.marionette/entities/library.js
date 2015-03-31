//= require backbone.marionette/entities/collection

Collections.Library = Backbone.Model.extend({
  collections: function () {
    return Collections.Collection.all;
  }
});
