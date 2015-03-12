Collections.module('Edit', function (Edit, Collections, Backbone, Marionette, $, _) {
  Edit.Controller = {
    makeView: function (opts) {
      var library    = opts.library,
          collection = opts.collection;

      var view = new Edit.View({
        model: collection
      });

      view.on('open-collection', function () {
        Collections.router.navigate(collection.get('href'), { trigger: true });
      });

      view.on('remove-collection', function (collection) {
        Collections.host.remove(collection).done(function () {
          library.collections().remove(collection);
        });
      });

      collection.on('change', _.debounce(function () {
        Collections.host.update(collection);
      }, 800));

      return view;
    }
  };
});
