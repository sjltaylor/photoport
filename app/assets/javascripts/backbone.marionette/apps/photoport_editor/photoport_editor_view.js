//= require photoport/photoport
//= require templates/photoport_editor/view

PhotoportCMS.module('PhotoportEditor', function (PhotoportEditor, PhotoportCMS, Backbone, Marionette, $, _) {
  PhotoportEditor.View = Marionette.Layout.extend({
    template: 'photoport_editor/view',
    className: 'photoport-editor',
    regions: {
      photoportContainerRegion: ".photoport-container-region"
    },
    initialize: function (opts) {
      this.photoportContainerView = opts.photoportContainerView;
    },
    onShow: function () {
      this.photoportContainerRegion.show(this.photoportContainerView);
    }
  });
});