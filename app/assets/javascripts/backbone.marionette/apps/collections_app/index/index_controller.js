Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.Controller = {
    makeView: function (opts) {
      var library = opts.library,
          collections = library.collections();

      var list = new Index.List({
        collection: collections,
        library: library
      });

      list.on('new-collection', function () {
        Collections.host.create(library).done(function (collectionAttributes) {
          var c = new Collections.Collection(collectionAttributes);
          collections.add(c);
        }).error(console.error);
      });

      list.on('childview:edit-collection', function (_, collection) {
        Collections.router.navigate(collection.get('edit'), { trigger: true });
      });

      return list;
    }
  };
});
