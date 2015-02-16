Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.Controller = {
    makeCollectionView: function (opts) {
      var collection = opts.collection;

      var uploadPanel =  Collections.UploadPanel.Controller.makeView({
        collection: collection,
        uploadPanelConfig: opts.uploadPanelConfig
      });

      var collectionView = new Index.CollectionView({
        model: collection,
        uploadPanel: uploadPanel
      });

      return collectionView;
    },
    makeIndexView: function (opts) {
      var library = opts.library,
          collections = library.collections();

      var indexView = new Index.View({
        collection: collections,
        library: library
      });

      return indexView;
    }
  };
});
