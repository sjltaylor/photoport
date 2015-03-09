Collections.module('Edit', function (Edit, Collections, Backbone, Marionette, $, _) {
  Edit.Controller = {
    makeView: function (opts) {
      var collection = opts.collection;

      var view = new Edit.View({
        model: collection
      });

      view.on('open-collection', function () {
        Collections.router.navigate(collection.get('show'), { trigger: true });
      });

      return view;
    }
  };
});
