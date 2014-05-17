Collections.Identity = Backbone.Model.extend({
  isIdentified: function () {
    return this.get('status') === 'identified';
  }
});
