Collections.Controller = {
  show: function () {
    this.load().done(function (landing) {
      Collections.Show.Controller.run(landing);
    });
  },
  collections: function () {
    this.load().done(function (landing) {
      Collections.Index.Controller.run(landing);
    });
  },
  sign_in: function () {
    this.load().done(function (landing) {
      Collections.layout.contentRegion.show(Collections.signInView);
    });
  },
  load: function () {
    var deferred = new $.Deferred();

    Collections.landingDeferred.done(function (landing) {
      deferred.resolve({
        landing: landing,
        layout: Collections.layout,
        identity: Collections.identity,
        identifyView: Collections.identifyView
      });
    });

    return deferred.promise();
  }
};
