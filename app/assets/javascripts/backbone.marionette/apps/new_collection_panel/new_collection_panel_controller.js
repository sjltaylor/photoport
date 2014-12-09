Collections.module('NewCollectionPanel', function (NewCollectionPanel, Collections, Backbone, Marionette, $, _) {

  NewCollectionPanel.Controller = {
    makeView: function (opts) {
      var newCollection = new Collections.Collection({}),
          library = opts.library,
          collections = library.collections();

      var view = new NewCollectionPanel.View({
        model: newCollection
      });

      view.on('new-collection', function () {
        collections.add(newCollection);

        Collections.host.create(library).done(function (collectionAttributes) {
          newCollection.set(collectionAttributes);
        }).error(console.error);
      });

      return view;
    }
  };
});
