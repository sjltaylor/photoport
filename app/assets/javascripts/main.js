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

  // views
  // this.identifyView = Collections.Identify.Controller.makeView({
  //   identity: this.identity,
  //   template: 'identify'
  // });
  // this.signInView = Collections.Identify.Controller.makeView({
  //   identity: this.identity
  // });
  // this.identityStatusView = Collections.IdentityStatus.Controller.makeView({
  //   identity: this.identity
  // });
  this.indexView = new Collections.Show.Controller.makeIndexView({
    identityStatusView: this.identityStatusView,
    library: this.library
  });

  var landingDeferred = new $.Deferred();
  this.landing = landingDeferred.promise();

  this.host.landing().done(function (landing) {
    this.identity.set(landing.identity);
    this.library.set({
      index: landing.index,
      add: landing.add,
      uploadPanelConfig: landing['upload_panel_config']
    });
    this.library.collections().set(landing.collections);

    landingDeferred.resolve(this);

  }.bind(this)).error(console.error);
}.bind(Collections));

Collections.on('start', function(){
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
