//= require templates/edit/collection

Collections.module('Edit', function (Edit, Collections, Backbone, Marionette, $, _) {

  Edit.View = Marionette.ItemView.extend({
    className: 'edit-collection',
    template: 'edit/collection',
    ui: {
      'open': '.js-open',
      'publicAccessUrl': '.js-public-access-url',
      'edit': '.js-edit',
      'close': '.js-close',
      'removeConfirm': '.js-remove-confirm',
      'remove': '.js-remove',
      'photoportContainer': '.photoport-container',
      'publicAccess': '.js-public-access'
    },
    events: {
      'click @ui.edit': 'handleEditCollection',
      'click @ui.remove': 'handleRemoveClick',
      'change @ui.publicAccess': 'handlePublicAccessChange',
      'click @ui.close': 'handleClose'
    },
    modelEvents: {
      'change:allow_public_access': 'updatePublicAccessUrlVisibility'
    },
    handleEditCollection: function (e) {
      e.preventDefault();
      this.model.set({ editing: true });
      this.trigger('edit-collection', this.model);
    },
    handlePublicAccessChange: function () {
      this.model.set({
        allow_public_access: this.ui.publicAccess.is(':checked')
      });
    },
    handleRemoveClick: function () {
      if (!!this.ui.removeConfirm.is(':checked')) {
        this.trigger('remove-collection', this.model);
      }
    },
    handleClose: function () {
      this.destroy();
    },
    onRender: function () {
      this.updatePublicAccessUrlVisibility();
      this.ui.edit.attr({ href: this.model.get('edit') });
      this.ui.open.attr({ href: this.model.get('href') });
      this.ui.open.text(this.ui.open.prop('href'));
    },
    updatePublicAccessUrlVisibility: function () {
      if (this.model.get('allow_public_access')) {
        this.ui.publicAccess.attr({checked: 'checked'});
        this.ui.publicAccessUrl.show();
      } else {
        this.ui.publicAccessUrl.hide();
      }
    }
  });
});
