Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {

  Show.Controller = {
    run: function (opts) {
      var landing = opts.landing,
          layout = opts.layout,
          identity = opts.identity,
          identifyView = opts.identifyView,
          signInView = opts.signInView;

      window.PHOTOPORT_CMS = {
        uploadPanelConfig: landing['upload_panel_config']
      };

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

      identifyView.on('close-identify', function () {
        layout.contentRegion.show(photoportContainerView);
      });

      signInView.on('close-identify', function () {
        layout.contentRegion.show(photoportContainerView);
      });

      layout.contentRegion.show(photoportContainerView);
    }
  };
});
