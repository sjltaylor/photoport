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

      // var attachItemView = function (collection) {
      //   collection.indexPhotoportContainer = Show.Controller.makePhotoportView({
      //     collection: collection
      //   });
      // }

      // collections.each(attachItemView);
      // collections.on('add', attachItemView);
      // collections.on('remove', function (collection) {
      //   collection.view.destroy()
      //   delete collection.view;
      // });

      var indexView = new Index.View({
        collection: collections,
        collectionViewDelegate: function (collection) {
          return Index.Controller.makeCollectionView({
            collection: collection,
            uploadPanelConfig: library.get('uploadPanelConfig')
          });
        }
      });

      // list.on('new-collection', function (geometry) {
      //   var collection = new Collections.Collection({
      //     geometry: geometry
      //   });
      //
      //   collections.add(collection);
      //
      //   Collections.host.create(library, geometry).done(function (collectionAttributes) {
      //     collection.set(collectionAttributes);
      //   });
      // });

      indexView.on('navigate', function (collection) {
        Collections.trigger('collection-index-navigate', collection);
      });

      return indexView;
    }
  };
});
