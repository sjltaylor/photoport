Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {

  Show.Controller = {
    run: function (opts) {
      var landing = opts.landing,
          layout = opts.layout,
          identity = opts.identity,
          identifyView = opts.identifyView;

      var collection = new Collections.Collection(landing.collection);

      var uploadPanel =  Collections.UploadPanel.Controller.makeView({
        collection: collection
      });

      var photoportContainerView = Collections.PhotoportContainer.Controller.makeView({
        collection: collection,
        identity: identity,
        uploadPanel: uploadPanel
      });

      photoportContainerView.on('save', function () {
        layout.contentRegion.show(identifyView);
      });

      identity.on('change:status', function () {
        if (identity.isIdentified()) {
          layout.contentRegion.show(photoportContainerView);
        }
      });

      identifyView.on('cancel', function () {
        layout.contentRegion.show(photoportContainerView);
      });

      layout.contentRegion.show(photoportContainerView);
    }
  };
});
