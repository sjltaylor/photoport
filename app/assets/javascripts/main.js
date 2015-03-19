//= require application
//= require ./collections
//= require_tree ./servers
//= require_tree ./backbone.marionette

Collections.addRegions({
  page: {
    selector: 'body',
    regionClass: Collections.ResizableRegion
  }
});

Collections.addInitializer(function () {
  var resize = function () {
    Collections.page.resize({ width: window.innerWidth, height: window.innerHeight });
  }

  $(window).on('resize', resize);
  resize();
});

Collections.addInitializer(function () {
  this.router = new this.Router({
    controller: this.Controller
  });

  this.identity = new Collections.Identity();
  this.library = new Collections.Library();

  this.repopulate();

}.bind(Collections));

Collections.repopulate = function () {
  var app = Collections;

  app.landing = new $.Deferred();

  app.host.landing().done(function (landing) {
    app.identity.set(landing.identity);

    var libraryAttributes = {
      index: landing.index
    };

    if (app.identity.isIdentified()) {
      libraryAttributes.add = landing.add;
      libraryAttributes.new = landing.new;
      libraryAttributes.uploadPanelConfig = landing['upload_panel_config'];
    }

    app.library.resetCollections(landing.collections || []);
    app.library.set(libraryAttributes);

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
