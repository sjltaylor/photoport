Collections.module('UploadPanel', function (UploadPanel, Collections, Backbone, Marionette, $, _) {

  UploadPanel.Controller = {
    uploadPhotos: function (opts) {
      var collection = opts.collection,
          files = opts.files,
          uploadPanelConfig = opts.uploadPanelConfig;


      function onS3UploadDone(data, statusText, jqXHR) {
        var fileKey = jqXHR.CollectionsMetadata.fileKey;
        console.warn("CALLING HOST WITH FILE KEY: ", fileKey);

        Collections.host.photos.create(collection, fileKey).success(function (photo) {
          console.warn("SERVER RESPONSE:", photo);
          collection.photos.add(photo);
        }).fail(function () {
          console.warn("FAILED CALL TO SERVER", arguments);
        });
      }

      function onS3UploadFail () {
        console.error('failed uploading photos to s3', arguments);
      }

      var promises = Collections.s3.uploadPhotos(uploadPanelConfig, files);

      promises.forEach(function (promise) {
        promise.done(onS3UploadDone).fail(onS3UploadFail);
      });
    },
    makeView: function (opts) {
      var controller = this;
      var uploadPanelConfig = opts.uploadPanelConfig;

      var uploadPanel = new UploadPanel.View();
      uploadPanel.on("files:selected", function (files) {
        controller.uploadPhotos({
          collection: opts.collection,
          files: files,
          uploadPanelConfig: uploadPanelConfig
        });
      });
      return uploadPanel;
    }
  };
});
