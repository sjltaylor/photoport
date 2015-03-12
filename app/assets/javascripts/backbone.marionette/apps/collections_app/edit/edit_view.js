//= require templates/edit/collection

Collections.module('Edit', function (Edit, Collections, Backbone, Marionette, $, _) {

  Edit.View = Marionette.ItemView.extend({
    className: 'edit-collection',
    template: 'edit/collection',
    ui: {
      'openCollection': '.js-open-collection',
      'name': '.js-name'
    },
    events: {
      'click @ui.openCollection': 'handleOpenCollection',
      'input @ui.name': 'handleNameInput'
    },
    handleOpenCollection: function (e) {
      e.preventDefault();
      this.trigger('open-collection', this.model);
    },
    handleNameInput: function () {
      this.model.set({ name: this.ui.name.val().trim() });
    },
    onRender: function () {
      this.ui.name.val(this.model.get('name'));
      this.ui.openCollection.attr({ href: this.model.get('show') });
    }
  });
});
