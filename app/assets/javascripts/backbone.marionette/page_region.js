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
    if (this.currentView) {
      this.currentView.resize({ width: window.innerWidth, height: window.innerHeight });
    }
  },
  onShow: function (view) {
    this.currentView = view;
    this.fitCurrentViewToWindow();
  }
});
