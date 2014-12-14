Collections.module('NewCollectionPanel', function (NewCollectionPanel, Collections, Backbone, Marionette, $, _) {

  NewCollectionPanel.Controller = {
    makeView: function (opts) {
      var library = opts.library,
          collections = library.collections(),
          newCollection = new Collections.Collection({
            show: library.get('new')
          });

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
