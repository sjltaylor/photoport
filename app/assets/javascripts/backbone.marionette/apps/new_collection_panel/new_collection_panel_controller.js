Collections.module('NewCollectionPanel', function (NewCollectionPanel, Collections, Backbone, Marionette, $, _) {

  NewCollectionPanel.Controller = {
    makeView: function (opts) {
      var library = opts.library,
          collections = library.collections(),
          newCollection = library.new();

      var view = new NewCollectionPanel.View({
        model: newCollection
      });

      view.on('new-collection', function () {
        Collections.host.create(library).done(function (collectionAttributes) {
          var c = new Collections.Collection(collectionAttributes);
          collections.add(c);
        }).error(console.error);
      });

      return view;
    }
  };
});
