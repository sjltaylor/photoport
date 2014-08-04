//= require templates/list_view
//= require templates/list_item_view
//= require spin.js/spin.js

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  ListEntryView = Marionette.ItemView.extend({
    template: 'list_item_view',
    tagName: 'li',
    ui: {
      name: 'a'
    },
    onRender: function () {
      this.ui.name.text(this.model.get('name'));
      this.ui.name.attr('href', this.model.get('show'));
    }
  });

  List.View = Marionette.CompositeView.extend({
    template: 'list_view',
    className: 'list-view',
    childViewContainer: 'ul.inner',
    childView: ListEntryView,
    ui: {
      controls: '.controls',
      new: '.js-new'
    },
    events: {
      'click .js-new': 'onNewCollection'
    },
    onNewCollection: function () {
      this.trigger('new-collection');
      this.startNewCollection();
    },
    onRender: function () {
      this.setupSpinner();
    },
    setupSpinner: function () {
      var opts = {
        lines: 10, // The number of lines to draw
        length:6, // The length of each line
        width: 3, // The line thickness
        radius: 6, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#808080', // #rgb or #rrggbb or array of colors
        speed: 1.6, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '55%', // Top position relative to parent
        left: '50%' // Left position relative to parent
      };

      this.spinner = new Spinner(opts);
    },
    startNewCollection: function () {
      this.ui.new.hide();
      this.spinner.spin(this.ui.controls[0]);
    },
    endNewCollection: function () {
      this.spinner.stop();
      this.ui.new.show();
    }
  });
});
