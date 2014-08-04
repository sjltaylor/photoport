Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  List.Controller = {
    makeView: function (opts) {
      var library = opts.library,
          collections = opts.library.collections();


      var list = new List.View({
        // the backbone collection not a Collections.Collection
        collection: collections
      });

      list.on('new-collection', function () {
        Collections.host.create(library).done(function (collection) {
          collections.add(collection);
          list.endNewCollection();
        });
      });

      return list;
    }
  };
});
