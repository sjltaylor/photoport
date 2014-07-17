Backbone.Marionette.Renderer.render = function (templateName, data) {
  var template = JST['templates/' + templateName];
  if (typeof template === 'function') return template(data);
  if (templateName) throw 'Template not found: ' + templateName;
};
