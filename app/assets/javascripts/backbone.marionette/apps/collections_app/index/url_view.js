Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.UrlView = Marionette.ItemView.extend({
    modelEvents: {
      'change:open': 'update'
    },
    initialize: function () {
      _.extend(this, this.options);
    },
    update: function (collection) {
      if (collection.isOpen()) {
        Backbone.history.navigate(collection.get('show'), { trigger: false });
      }
    }
  });
});
