//= require templates/list_view
//= require ./list_item_view
//= require ./touch_handler
//= require ./geometry

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  var states = {
    'idle': 'idle',
    'move': 'move'
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
      'hold:plane': 'onHoldPlane'
    },
    collectionEvents: {
      "change":"update"
    },
    initialize: function () {
      this.state = states.idle;
      this.touchHandler = new List.TouchHandler(this);
    },
    onRender: function () {
      this.touchHandler.start();
      this.update();
    },
    onHoldPlane: function (event) {
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
    update: function () {
      if (this.collection.length > 0) {
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
      view.on("update", this.positionChild.bind(this, view));
      return view;
    },
    moveChild: function (view, event) {
      event.preventDefault();

      var model = view.model;
      var geometry = model.get('geometry');

      var mousemove = function (e) {
        geometry.cx =
        $(this.el).css({
          left: e.pageX + 'px',
          top: e.pageY + 'px'
        })
      }.bind(this);

      var mouseup = function () {
        $(this.el).unbind('mousemove', mousemove);
        $(this.el).unbind('mouseup', mouseup);
      }.bind(this);

      $(this.el).mousemove(mousemove);
      $(this.el).mouseup(mouseup);
    }
  });
});
