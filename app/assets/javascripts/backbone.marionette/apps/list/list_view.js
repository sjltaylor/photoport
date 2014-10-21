//= require templates/list_view
//= require ./list_item_view
//= require ./touch_handler
//= require ./geometry

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  List.View = Marionette.CompositeView.extend({
    template: 'list_view',
    className: 'list-view',
    childViewContainer: 'ul',
    childView: ListItemView,
    ui: {
      createPrompt: '.create-prompt'
    },
    events: {
      'hold:plane': 'onHoldPlane',
      'hold:object': 'onHoldObject',
      'drag:object': 'onDragObject',
      'release:object': 'onReleaseObject'
    },
    collectionEvents: {
      "change":"update"
    },
    initialize: function () {
      this.touchHandler = new List.TouchHandler(this);
    },
    onRender: function () {
      this.touchHandler.start();
      this.update();
    },
    onHoldPlane: function (event) {
      var mouseEvent = event.originalEvent.detail.mouseEvent;
      var bounds = this.el.getBoundingClientRect();

      var geometry = {
        cx: mouseEvent.clientX,
        cy: mouseEvent.clientY,
        width: bounds.width,
        height: bounds.height
      };

      this.trigger('new-collection', geometry);
    },
    onHoldObject: function (event) {
      var mouseEvent = event.originalEvent.detail.mouseEvent;
      var view = event.originalEvent.detail.view;
      var model = view.model;
      model.beginDrag(mouseEvent.clientX, mouseEvent.clientY);
    },
    onDragObject: function () {
      var mouseEvent = event.originalEvent.detail.mouseEvent;
      var view = event.originalEvent.detail.view;
      var model = view.model;
      model.move()
    },
    onReleaseObject: function () {
      var mouseEvent = event.originalEvent.detail.mouseEvent;
      var view = event.originalEvent.detail.view;
      var model = view.model;
      model.endDrag(mouseEvent.clientX, mouseEvent.clientY)
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
      this.touchHandler.listenToObject(view);
      this.positionChild(view);
      view.on("update", this.positionChild.bind(this, view));
      return view;
    }
  });
});
