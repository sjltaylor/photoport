Backbone.Marionette.Renderer.render = function (templateName, data) {
  var template = JST['templates/' + templateName];
  if (typeof template === 'function') return template(data);
  if (templateName) throw 'Template not found: ' + templateName;
};


Backbone.Marionette.View.prototype.resize = function (dimensions) {
  var w = dimensions.width, h = dimensions.height;
  this.$el.width(w).height(h);
  Marionette.triggerMethod.call(this, 'resize', dimensions);
}

Collections.ResizableRegion = Backbone.Marionette.Region.extend({});

_.extend(Collections.ResizableRegion.prototype, {
  resize: function (dimensions) {
    Backbone.Marionette.View.prototype.resize.apply(this, arguments);

    if (this.currentView) {
      this.currentView.resize(dimensions);
    }
  },
  onShow: function (view) {
    this.currentView = view;
    this.currentView.resize({
      width: this.$el.width(),
      height: this.$el.height()
    });
  }
});
