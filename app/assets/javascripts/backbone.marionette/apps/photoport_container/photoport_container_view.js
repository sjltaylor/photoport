//= require photoport/photoport

PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {
  PhotoportContainer.View = Marionette.ItemView.extend({
    className: 'photoport-container',
    events: {
      'photoport-content-hold': 'onPhotoportContentHold'
    },
    initialize: function () {
      this.uploadPanel = this.options.uploadPanel;
      this.photoport = new Photoport({
        container: this.el
      });
    },
    onRender: function () {
      this.uploadPanel.render();
    },
    onShow: function () {
      this.photoport.start();
    },
    add: function (content) {
      this.photoport.append(content);
      this.photoport.seek('last');
    },
    onPhotoportContentHold: function (e) {
      this.showEditPanel(e.originalEvent.detail.content.editPanel);
    },
    showUploadPanel: function () {
      this.photoport.interlude({
        el: this.uploadPanel.el
      });
    },
    showEditPanel: function (editPanel) {
      this.photoport.interlude({
        el: editPanel.el
      });
      var closeHandler = function () {
        // remove this handler (watch out for .bind(this) !!)
        // this.resume()
      }
      //editPanel.on('close', )
    },
    resume: function () {
      this.photoport.resume();
    }
  });
});