//= require templates/photo_upload_panel

PhotoportCMS.module('UploadPanel', function (UploadPanel, PhotoportCMS, Backbone, Marionette, $, _) {
  UploadPanel.View = Marionette.ItemView.extend({
    template: "photo_upload_panel",
    className: 'photoport-cms-upload-panel',
    events: {
      'change    .js-file-input'  : 'handleFileInputChange',
      'click     .js-choose-files': 'handleChooseFilesClick',
      'drop      .js-dropzone'    : 'handleDrop',
      'dragenter .js-dropzone'    : 'noopHandler',
      'dragexit  .js-dropzone'    : 'noopHandler',
      'dragover  .js-dropzone'    : 'noopHandler'
    },
    handleFileInputChange: function (e) {
      e.stopPropagation();
      e.preventDefault();

      this.triggerFilesSelected(e.target.files);
    },
    handleChooseFilesClick: function () {
      var clickEvent = new MouseEvent('click', false, false); // click, canBubble, !cancellable
      this.el.querySelector('.js-file-input').dispatchEvent(clickEvent);
    },
    handleDrop: function (e) {
      e.stopPropagation();
      e.preventDefault();

      this.triggerFilesSelected(e.originalEvent.dataTransfer.files);
    },
    noopHandler: function (e) {
      e.stopPropagation();
      e.preventDefault();
    },
    triggerFilesSelected: function (files) {
      if (files.length > 0) {
        this.trigger('files:selected', files);
      }
    }
  });
});