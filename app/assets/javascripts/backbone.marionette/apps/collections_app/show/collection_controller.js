Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  Show.Controller = {
    makeView: function (opts) {
      var collection = opts.collection;

      var uploadPanel =  Collections.UploadPanel.Controller.makeView({
        collection: collection,
        uploadPanelConfig: opts.uploadPanelConfig
      });

      var view = new Show.CollectionView({
        model: collection,
        uploadPanel: uploadPanel
      });

      view.on('edit-photo', function (args) {
        var panel = Collections.OptionsPanel.Controller.makeView({
          collection: collection,
          photo: args.photo
        });
        panel.render();
        view.showPanel(panel);
      });

      return view;
    }
  };
});
