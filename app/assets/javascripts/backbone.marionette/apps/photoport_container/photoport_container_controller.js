Collections.module('PhotoportContainer', function (PhotoportContainer, Collections, Backbone, Marionette, $, _) {

  PhotoportContainer.Controller = {
    makeView: function (opts) {
      var collection = opts.collection;

      var view =  new PhotoportContainer.View({
        uploadPanel: opts.uploadPanel,
        collection: collection,
        identity: opts.identity,
        contentDescriptorDelegate: this.contentDescriptorFor
      });

      view.on('edit', function (content) {
        var editPanel = Collections.EditPanel.Controller.makeView({
          collection: collection,
          photo: content.photo
        }).render();
        view.showPanel(editPanel);
      });

      return view;
    }
  };
});
