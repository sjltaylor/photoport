Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {
  List.Controller = {
    makeView: function (opts) {
      var library = opts.library,
          collections = opts.library.collections();

      var list = new List.View({
        // the backbone collection not a Collections.Collection
        collection: collections
      });

      list.on('new-collection', function (geometry) {
        var collection = new Collections.Collection({
          geometry: geometry
        });

        collections.add(collection);

        Collections.host.create(library, geometry).done(function (collectionAttributes) {
          collection.set(collectionAttributes);
        });
      });

      return list;
    }
  };
});
