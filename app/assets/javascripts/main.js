//= require application
//= require ./collections
//= require_tree ./servers
//= require_tree ./backbone.marionette

Collections.addRegions({
  page: {
    selector: "body",
    regionClass: Collections.PageRegion
  }
});

Collections.addInitializer(function () {
  this.router = new this.Router({
    controller: this.Controller
  });

  this.identity = new Collections.Identity();

  this.library = new Collections.Library();

  this.identifyView = Collections.Identify.Controller.makeView({
    identity: this.identity
  });

  this.indexView = new Collections.Index.Controller.makeIndexView({
    library: this.library
  });

  this.identity.on('change:status', function () {
    console.warn('change-status', arguments);
    if (this.identity.isIdentified()) {
      this.fetchLanding();
    }
  }.bind(this));

  this.fetchLanding();

}.bind(Collections));

Collections.fetchLanding = function () {
  var app = Collections;

  app.landing = new $.Deferred();

  app.host.landing().done(function (landing) {
    app.identity.set(landing.identity);
    app.library.set({
      index: landing.index,
      add: landing.add,
      new: landing.new,
      uploadPanelConfig: landing['upload_panel_config']
    });

    app.library.collections().reset(landing.collections);

    app.landing.resolve(app);

  }).error(console.error);
};

Collections.on('start', function () {
  if (Backbone.history) {
    Backbone.history.start({ pushState: true });
    $(document).on('click', 'a[data-push-state]', function (evt) {

      var href = $(this).attr('href');
      var protocol = this.protocol + '//';

      if (href.slice(protocol.length) !== protocol) {
        evt.preventDefault();
        Collections.router.navigate(href, true);
      }
    });
  }
});

jQuery(document).ready(function () {
  Collections.start();
});
