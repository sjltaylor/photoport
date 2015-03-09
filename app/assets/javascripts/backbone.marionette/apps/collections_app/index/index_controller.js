Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.Controller = {
    makeView: function (opts) {
      var library = opts.library,
          collections = library.collections();

      var list = new Index.List({
        collection: collections,
        library: library
      });

      list.on('childview:new-collection', function () {
        Collections.host.create(library).done(function (collectionAttributes) {
          var c = new Collections.Collection(collectionAttributes);
          collections.add(c);
        }).error(console.error);
      });

      list.on('childview:edit-collection', function (_, collection) {
        layout.edit.show(Collections.Edit.Controller.makeView({
          collection: collection
        }));
      });

      var editPlaceholder = new Index.EditPlaceholder();

      var layout = new Index.Layout({
        listView: list,
        editPlaceholder: editPlaceholder
      });

      return layout;
    }
  };
});
