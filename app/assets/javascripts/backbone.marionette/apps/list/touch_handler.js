Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  List.TouchHandler = function (listView) {
    this.listView = listView
    this.timeout = 350
  };

  List.TouchHandler.prototype = {
    start: function () {
      $(this.listView.el).on('mousedown', this.mousedownOnPlane.bind(this));
    },
    listenToObject: function (view) {
      view.el.addEventListener('mousedown', this.mousedownOnObject.bind(this, view));
    },
    mousedownOnObject: function (view, mousedownEvent) {
      mousedownEvent.preventDefault();
      mousedownEvent.stopPropagation();

      var onmousemove = function (mousemoveEvent) {
        this.listView.el.dispatchEvent(new CustomEvent('drag:object', {
          bubbles: true,
          detail: {
            mouseEvent: mousemoveEvent,
            view: view
          }
        }));
      }.bind(this);

      var onmouseup = function (mouseupEvent) {
        this.listView.el.removeEventListener('mousemove', onmousemove);
        window.removeEventListener('mouseup', onmouseup);
        this.listView.el.dispatchEvent(new CustomEvent('release:object', {
          bubbles: true,
          detail: {
            mouseEvent: mouseupEvent,
            view: view
          }
        }));
      }.bind(this);

      this.listView.el.addEventListener('mousemove', onmousemove);

      window.addEventListener('mouseup', onmouseup);


      this.listView.el.dispatchEvent(new CustomEvent('hold:object', {
        bubbles: true,
        detail: {
          mouseEvent: mousedownEvent,
          view: view
        }
      }));
    },
    mousedownOnPlane: function (mousedownEvent) {
      var el = this.listView.el;

      var timeout = setTimeout(function () {
        el.removeEventListener('mouseup', mouseupHandler);

        el.dispatchEvent(new CustomEvent('hold:plane', {
          bubbles: true,
          detail: {
            mouseEvent: mousedownEvent
          }
        }));
      }, this.timeout);

      var mouseupHandler = function (mouseupEvent) {
        e.preventDefault();
        e.stopPropagation();

        el.removeEventListener('mouseup', mouseupHandler);
        clearTimeout(timeout);

        el.dispatchEvent(new CustomEvent('tap', {
          bubbles: true,
          detail: {
            mouseEvent: mouseupEvent
          }
        }));
      };

      el.addEventListener('mouseup', mouseupHandler);
    }
  }
});
