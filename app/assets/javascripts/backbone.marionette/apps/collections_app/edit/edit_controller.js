Collections.module('Edit', function (Edit, Collections, Backbone, Marionette, $, _) {
  Edit.Controller = {
    makeView: function (opts) {
      var library    = opts.library,
          collection = opts.collection;

      var view = new Edit.View({
        model: collection
      });

      view.on('edit-collection', function () {
        Collections.router.navigate(collection.get('edit'), { trigger: true });
      });

      view.on('remove-collection', function (collection) {
        Collections.host.remove(collection).done(function () {
          library.collections().remove(collection);
        });
      });

      view.on('render', function () {
        collection.set({ editing: true });
      });

      view.on('destroy', function () {
        collection.set({ editing: false });
      });

      collection.on('change', function () {
        Collections.host.update(collection);
      });

      return view;
    }
  };
});
