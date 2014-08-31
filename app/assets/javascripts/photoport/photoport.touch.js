//= require_self
//= require photoport/photoport.deferred
//= require photoport/photoport.touch

Photoport.touch = function touch (el, options) {
  var options = options || {};
  options.timeout = options.timeout >= 0 ? options.timeout : 800;

  el.addEventListener('mousedown', function (mouseDownEvent) {

    var removeEventListeners = function () {
      el.removeEventListener('mouseup', mouseupHandler);
      el.removeEventListener('mousemove', mousemoveHandler);
    }

    var timeout = setTimeout(function () {
      removeEventListeners();

      el.dispatchEvent(new CustomEvent('hold', {
        bubbles: true,
        detail: {
          mouseDownEvent: mouseDownEvent
        }
      }));
    }, options.timeout);

    var mousemoveHandler = function (e) {
      removeEventListeners();
      clearTimeout(timeout);
    }

    var mouseupHandler = function (e) {
      removeEventListeners();
      clearTimeout(timeout);
      el.dispatchEvent(new CustomEvent('tap', {
        bubbles: true,
        detail: {
          mouseDownEvent: mouseDownEvent
        }
      }));
    };

    el.addEventListener('mouseup', mouseupHandler);
    el.addEventListener('mousemove', mousemoveHandler);
  });
};
