Collections.module('OptionsPanel', function (OptionsPanel, Collections, Backbone, Marionette, $, _) {

  OptionsPanel.Controller = {
    makeView: function (opts) {
      var collection = opts.collection,
          photo      = opts.photo;

      var view = new OptionsPanel.View(opts);

      view.once('remove-current', function () {
        Collections.host.photos.remove(photo).done(function () {
          collection.photos.remove(photo);
        }).fail(console.error);
      });

      return view;
    }
  };
});
