//= require templates/list_view
//= require templates/list_item_view

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {
  var randomNames = [
    "Mice on Wheels",
    "Ruined Cakes",
    "Stuff and Things",
    "Things and Stuff",
    "Articles of Miscellany",
    "Varying Whitenoise Displays",
    "Fruit of the Loom",
    "Pigeon Examples",
    "Pointless Buildings",
    "Countries of Mystery",
    "Hit List"
  ];

  function randomName() {
    return randomNames[Math.floor(Math.random() * randomNames.length)];
  }

  ListEntryView = Marionette.ItemView.extend({
    template: 'list_item_view',
    tagName: 'li',
    ui: {
      name: 'a'
    },
    onRender: function () {
      this.ui.name.text(randomName());
      this.ui.name.attr('href', this.model.get('show'));
    }
  });

  List.View = Marionette.CompositeView.extend({
    template: 'list_view',
    className: 'list-view',
    childViewContainer: 'ul.inner',
    childView: ListEntryView,
    ui: {

    },
    initialize: function () {

    }
  });
});
