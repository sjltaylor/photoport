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

      var contentDescriptor = function (collection) {
        if (collection.contentDescriptor) return collection.contentDescriptor;

        var view;

        if (collection.isNew()) {
          view = Collections.NewCollectionPanel.Controller.makeView({
            library: library
          });
        } else {
          view = Index.Controller.makeCollectionView({
            collection: collection,
            uploadPanelConfig: library.get('uploadPanelConfig')
          });
        }

        collection.contentDescriptor = {
          el: view.el,
          view: view,
          collection: collection
        };

        return collection.contentDescriptor;
      }

      var indexView = new Index.View({
        collection: collections,
        contentDescriptor: contentDescriptor
      });

      var urlView = new Index.UrlView({
        model: collections
      });

      indexView.on('selection-change', function (collection) {
        library.open(collection);
      });

      return indexView;
    }
  };
});
