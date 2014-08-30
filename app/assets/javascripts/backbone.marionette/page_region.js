/*
  Region extensions shows and hides regions rather than closing and removing them.
*/
Collections.PageRegion = Backbone.Marionette.Region.extend({});

_.extend(Collections.PageRegion.prototype, {
  initialize: function () {
    this.views = [];
    $(window).on('resize', this.fitCurrentViewToWindow.bind(this));
  },
  fitCurrentViewToWindow: function () {
    if(this.currentView) {
      this.currentView.resize({ width: window.innerWidth, height: window.innerHeight });
    }
  },
  /*
    shows the view without removed the previous view(s) from the dom
  */
  show: function (view) {
    if (this.currentView === view) {
      return this;
    }

    this._ensureElement();
    if (this.views.indexOf(view) === -1) {
      view.render();
      this.$el.append(view.$el);
      this.views.push(view);
    }
    this.close();
    view.$el.show();
    this.currentView = view;
    Marionette.triggerMethod.call(this, "show", view);
    Marionette.triggerMethod.call(view, "show");

    this.fitCurrentViewToWindow();
    return this;
  },
  /*
    closes the current view by hiding it
  */
  close: function () {
    this.views.forEach(function (view) {
      view.$el.hide();
    });
    if (this.currentView) {
      Marionette.triggerMethod.call(this, "close", this.currentView);
    }
    return this;
  },
  /*
    A way to completely remove the view
  */
  eject: function (view) {
    this.views.splice(this.views.indexOf(view), 1);
    view.close();
  }
});
