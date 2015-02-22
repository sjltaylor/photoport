Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.Controller = {
    makeView: function (opts) {
      var library = opts.library,
          collections = library.collections();

      var indexView = new Index.View({
        collection: collections,
        library: library
      });

      indexView.on('childview:new-collection', function () {
        Collections.host.create(library).done(function (collectionAttributes) {
          var c = new Collections.Collection(collectionAttributes);
          collections.add(c);
        }).error(console.error);
      });

      indexView.on('childview:open-collection', function (_, collection) {
        Collections.router.navigate(collection.get('show'), { trigger: true });
      });

      return indexView;
    }
  };
});
