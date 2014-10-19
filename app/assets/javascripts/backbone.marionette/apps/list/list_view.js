//= require templates/list_view
//= require ./list_item_view

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

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
    childView: ListItemView,
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
    startNewCollection: function (geometry) {
      this.state = 'new-collection-in-progress';
      this.ui.createPrompt.hide();
      this.updatePrompt();
    },
    endNewCollection: function () {
      this.state = 'idle';
      this.updatePrompt();
    },
    updatePrompt: function () {
      if (this.state === 'new-collection-in-progress' || this.collection.length) {
        this.ui.createPrompt.hide();
      } else {
        this.ui.createPrompt.show();
      }
    },
    onResize: function (dimensions) {
      this.$el.width(dimensions.width).height(dimensions.height);
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
