Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  Show.Controller = {
    makeView: function (opts) {
      var collection = opts.collection;

      var uploadPanel =  Collections.UploadPanel.Controller.makeView({
        collection: collection,
        uploadPanelConfig: opts.uploadPanelConfig
      });

      var collectionView = new Show.CollectionView({
        model: collection,
        uploadPanel: uploadPanel
      });

      return collectionView;
    }
  };
});
