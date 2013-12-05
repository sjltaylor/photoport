PhotoportCMS.module('PhotoportEditor', function (PhotoportEditor, PhotoportCMS, Backbone, Marionette, $, _) {

  PhotoportEditor.Controller = {
    makeView: function (opts) {
      var collection = opts.collection;

      var uploadPanel = PhotoportCMS.UploadPanel.Controller.makeView({collection: collection});

      var photoportContainerView = new PhotoportCMS.PhotoportContainer.Controller.makeView({
        uploadPanel: uploadPanel,
        collection: collection
      });

      var editorView = new PhotoportEditor.View({
        photoportContainerView: photoportContainerView
      });

      return editorView;
    }
  };
});