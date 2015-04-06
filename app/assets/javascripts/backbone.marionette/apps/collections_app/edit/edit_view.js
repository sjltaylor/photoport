//= require templates/edit/collection

Collections.module('Edit', function (Edit, Collections, Backbone, Marionette, $, _) {

  Edit.View = Marionette.ItemView.extend({
    className: 'edit-collection',
    template: 'edit/collection',
    ui: {
      'open': '.js-open',
      'edit': '.js-edit',
      'name': '.js-name',
      'close': '.js-close',
      'remove': '.js-remove',
      'publicAccess': '.js-public-access',
      'removeConfirm': '.js-remove-confirm',
      'photoportContainer': '.photoport-container'
    },
    events: {
      'click @ui.close': 'handleClose',
      'input @ui.name': 'handleNameChange',
      'click @ui.remove': 'handleRemoveClick',
      'click @ui.edit': 'handleEditCollection',
      'change @ui.publicAccess': 'handlePublicAccessChange'
    },
    modelEvents: {
      'change:allow_public_access': 'updatePublicAccessUrlVisibility'
    },
    initialize: function () {
      this.handleNameChange = _.throttle(this.handleNameChange,
        500,
        {
          leading: false,
          trailing: true
        });
    },
    handleClose: function () {
      this.trigger('user-close');
    },
    handleNameChange: function () {
      this.model.set({
        name: this.ui.name.val().trim()
      });
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
    onRender: function () {
      this.updatePublicAccessUrlVisibility();
      this.ui.edit.attr({ href: this.model.get('edit') });
      this.ui.open.attr({ href: this.model.get('href') });
      this.ui.open.text(this.ui.open.prop('href'));
      this.ui.name.val(this.model.get('name'));
    },
    onShow: function () {
      this.ui.name.focus();
    },
    updatePublicAccessUrlVisibility: function () {
      if (this.model.get('allow_public_access')) {
        this.ui.publicAccess.attr({checked: 'checked'});
        this.ui.open.show();
      } else {
        this.ui.open.hide();
      }
    }
  });
});
