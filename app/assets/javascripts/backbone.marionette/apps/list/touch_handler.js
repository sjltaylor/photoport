Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  List.TouchHandler = function (listView) {
    this.listView = listView
    this.timeout = 350
  };

  List.TouchHandler.prototype = {
    start: function () {
      $(this.listView.el).on('mousedown', this.mousedownOnPlane.bind(this));
    },
    mousedownOnPlane: function (mousedownEvent) {
      var el = this.listView.el;

      var timeout = setTimeout(function () {
        el.removeEventListener('mouseup', mouseupHandler);

        el.dispatchEvent(new CustomEvent('hold:plane', {
          bubbles: true,
          detail: {
            startEvent: mousedownEvent
          }
        }));
      }, this.timeout);

      var mouseupHandler = function (e) {
        e.preventDefault();
        e.stopPropagation();

        el.removeEventListener('mouseup', mouseupHandler);
        clearTimeout(timeout);

        el.dispatchEvent(new CustomEvent('tap', {
          bubbles: true,
          detail: {
            startEvent: startEvent
          }
        }));
      };

      el.addEventListener('mouseup', mouseupHandler);
    }
  }
});
