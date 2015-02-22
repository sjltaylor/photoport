Collections.module('NewCollectionPanel', function (NewCollectionPanel, Collections, Backbone, Marionette, $, _) {

  NewCollectionPanel.Controller = {
    makeView: function (opts) {
      var library = opts.library,
          collections = library.collections(),
          newCollection = library.new();

      var view = new NewCollectionPanel.View({
        model: newCollection
      });

      return view;
    }
  };
});
