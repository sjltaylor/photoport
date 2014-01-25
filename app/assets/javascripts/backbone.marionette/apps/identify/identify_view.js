//= require templates/identify

PhotoportCMS.module('Identify', function (Identify, PhotoportCMS, Backbone, Marionette, $, _) {
  Identify.View = Marionette.ItemView.extend({
    template: 'identify',
    className: 'identify-view',
    events: {
      'click .js-cancel': 'onCancelSave'
    },
    onCancelSave: function () {
      this.trigger('cancel-save');
    }
  });
});