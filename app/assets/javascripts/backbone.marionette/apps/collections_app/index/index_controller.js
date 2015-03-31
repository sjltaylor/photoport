Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.Controller = {
    makeView: function (opts) {
      var library = opts.library,
          collections = library.collections();

      var list = new Index.List({
        collection: collections,
        library: library
      });

      var layout = new Index.Layout({
        listView: list,
        editPlaceholder: Index.Controller.makeEditPlaceholder({
          library: library
        })
      });

      var editCollection = function (collection) {
        layout.edit.show(Collections.Edit.Controller.makeView({
          collection: collection,
          library: library
        }));
      }

      library.on('new-collection', function () {
        Collections.host.create(library).done(function (collectionAttributes) {
          var c = new Collections.Collection(collectionAttributes);
          collections.add(c);
          editCollection(c);
          list.scrollToTop();
        }).error(console.error);
      });

      list.on('childview:edit-collection', function (_, collection) {
        editCollection(collection);
      });

      library.collections().on('remove', function (collection) {
        layout.edit.show(Index.Controller.makeEditPlaceholder({
          library: library
        }));
      });

      library.collections().on('change:editing', function (collection, newValue) {
        if (!newValue) {
          layout.edit.show(Index.Controller.makeEditPlaceholder({
            library: library
          }));
        }
      });


      return layout;
    },
    makeEditPlaceholder: function (opts) {
      var library = opts.library;

      return new Index.EditPlaceholder({
        model: library
      });
    }
  };
});
