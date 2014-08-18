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

  function touchhold (el, startEvent, timeout) {

    var timeout = setTimeout(function () {
      el.removeEventListener('mouseup', mouseupHandler);

      el.dispatchEvent(new CustomEvent('hold', {
        bubbles: true,
        detail: {
          startEvent: startEvent
        }
      }));
    }, timeout || 350);

    var mouseupHandler = function (e) {
      e.preventDefault();
      e.stopPropagation();

      el.removeEventListener('mouseup', mouseupHandler);
      clearTimeout(timeout);

      el.dispatchEvent(new CustomEvent('tap', {
        bubbles: true,
        detail: {
          startEvent: startEvent
        }
      }));
    };

    el.addEventListener('mouseup', mouseupHandler);
  };

  List.View = Marionette.CompositeView.extend({
    template: 'list_view',
    className: 'list-view',
    childViewContainer: 'ul',
    childView: ListEntryView,
    ui: {
      createPrompt: '.create-prompt'
    },
    events: {
      'mousedown': 'onClickDown',
      'hold': 'onNewCollection'
    },
    initialize: function () {
      this.state = 'idle';
    },
    onNewCollection: function (event) {
      var startEvent = event.originalEvent.detail.startEvent;
      var bounds = this.el.getBoundingClientRect();

      var geometry = {
        cx: startEvent.clientX,
        cy: startEvent.clientY,
        width: bounds.width,
        height: bounds.height
      };

      this.trigger('new-collection', geometry);
    },
    onClickDown: function (e) {
      touchhold(this.el, e);
    },
    onRender: function () {
      this.updatePrompt();
    },
    setupSpinner: function (geometry) {
      var opts = {
        lines: 10, // The number of lines to draw
        length:6, // The length of each line
        height: 3, // The line thickness
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
        top: geometry.cy + 'px', // Top position relative to parent
        left: geometry.cx + 'px' // Left position relative to parent
      };

      this.spinner = new Spinner(opts);
    },
    startNewCollection: function (geometry) {
      this.state = 'new-collection-in-progress';
      this.ui.createPrompt.hide();
      this.setupSpinner(geometry);
      this.spinner.spin(this.el);
      this.updatePrompt();
    },
    endNewCollection: function () {
      this.state = 'idle';
      this.spinner.stop();
      delete this.spinner;
      this.updatePrompt();
    },
    updatePrompt: function () {
      if (this.state === 'new-collection-in-progress' || this.collection.length) {
        this.ui.createPrompt.hide();
      } else {
        this.ui.createPrompt.show();
      }
    },
    updateGeometry: function (parentBounds) {
      this.$el.width(parentBounds.width).height(parentBounds.height);
      var viewportBounds = this.el.getBoundingClientRect();
      var promptBounds = this.ui.createPrompt[0].getBoundingClientRect();

      var left = (viewportBounds.width / 2) - (promptBounds.width / 2);
      var top  = (viewportBounds.height / 2) - (promptBounds.height / 2);

      this.ui.createPrompt.css({
        left: left,
        top: top
      });
    },
    repositionChildren: function () {
      this.children.each(this.positionChild.bind(this));
    },
    positionChild: function (view) {
      var inst = view.model;

      var centerX = inst.get('geometry').cx;
      var centerY = inst.get('geometry').cy;

      var width = view.$el.width();
      var height = view.$el.height();

      var x = centerX - (width / 2);
      var y = centerY - (height / 2);

      view.$el.css({
        top: y + 'px',
        left: x + 'px'
      });

      return {
        x: x,
        y: y
      };
    },
    addChild: function(child, ChildView, index){
      var view = Backbone.Marionette.CollectionView.prototype.addChild.apply(this, arguments);
      this.positionChild(view);
      return view;
    }
  });
});
