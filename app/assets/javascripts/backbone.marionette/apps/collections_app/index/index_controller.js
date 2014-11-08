Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.Controller = {
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
        identityStatusView: opts.identityStatusView,
        collection: collections
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

      return indexView;
    }
  };
});
