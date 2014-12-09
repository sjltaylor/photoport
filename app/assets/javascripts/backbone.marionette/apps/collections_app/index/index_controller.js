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

      var newCollectionPanel = Collections.NewCollectionPanel.Controller.makeView({
        library: library
      });

      var indexView = new Index.View({
        collection: collections,
        newCollectionPanel: newCollectionPanel,
        collectionViewDelegate: function (collection) {
          return Index.Controller.makeCollectionView({
            collection: collection,
            uploadPanelConfig: library.get('uploadPanelConfig')
          });
        }
      });

      indexView.on('navigate', function (collection) {
        Collections.trigger('collection-index-navigate', collection);
      });

      return indexView;
    }
  };
});
