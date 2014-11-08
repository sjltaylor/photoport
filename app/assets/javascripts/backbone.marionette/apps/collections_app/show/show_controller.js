Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  Show.Controller = {
    makePhotoportView: function (opts) {
      var collection = opts.collection,
          identity = opts.identity;

      var uploadPanel =  Collections.UploadPanel.Controller.makeView({
        collection: collection,
        uploadPanelConfig: opts.uploadPanelConfig
      });

      var photoportContainerView = Collections.PhotoportContainer.Controller.makeView({
        collection: collection,
        identity: identity,
        uploadPanel: uploadPanel
      });

      return photoportContainerView;
    }
  };
});
