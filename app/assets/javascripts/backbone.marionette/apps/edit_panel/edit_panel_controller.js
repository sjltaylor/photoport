Collections.module('EditPanel', function (EditPanel, Collections, Backbone, Marionette, $, _) {

  EditPanel.Controller = {
    makeView: function (opts) {
      var collection = opts.collection,
          photo      = opts.photo;

      var view = new EditPanel.View(opts);

      view.once('remove-current', function () {
        Collections.host.photos.remove(photo).done(function () {
          collection.photos.remove(photo);
        }).fail(console.error);
      });
      
      return view;
    }
  };
});
