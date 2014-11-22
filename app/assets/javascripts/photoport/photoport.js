//= require_self
//= require 'photoport/photoport.deferred'

Photoport = (function () {

  function checkOptions (options) {
    if (!(options.container instanceof HTMLDivElement)) {
      throw "container must be an instance of HTMLDivElement but was: " + options.container;
    }
  }

  function div (className) {
    var e = document.createElement('DIV');
    e.className = className || '';
    return e;
  }

  function span (className) {
    var e = document.createElement('SPAN');
    e.className = className || '';
    return e;
  }

  function build () {
    var dom = {
      root      : div('photoport'),
      port      : div('photoport-port'),
      content   : div('photoport-content'),
      interlude : div('photoport-interlude'),
      keyframes : document.createElement('STYLE')
    };

    dom.root.appendChild(dom.port);
    dom.port.appendChild(dom.content);
    dom.port.appendChild(dom.interlude);
    dom.root.appendChild(dom.keyframes);


    dom.interlude.style.display = 'none';
    dom.keyframes.classList.add('photoport-bounce-keyframes');

    return dom;
  }

  function decr(p) {
    return Math.max(p - 1, 0);
  }

  function Photoport (options) {
    checkOptions(options);

    this.options = {
      keyboardNavigationEnabled: !!options.keyboardNavigationEnabled,
      direction: options.direction
    }

    this.container = options.container;
    this.dom = build();
    this.container.appendChild(this.dom.root);
    this.sequence = [];
    this.__onDestroy__ = [];
    this.position = null;
    this.state = 'normal';
    this.interludeContent = null;

    this.dom.content.addEventListener('webkitAnimationEnd', function () {
      this.dom.content.style.webkitAnimation = '';
      this.dom.keyframes.innerHTML = '';
    }.bind(this));

    if (this.options.direction === 'vertical') {
      this.navigation = {
        coordinate: 'top',
        dimension: 'height',
        nextKeyCode: 40,
        previousKeyCode: 38
      };
    } else {
      this.navigation = {
        coordinate: 'left',
        dimension: 'width',
        nextKeyCode: 39,
        previousKeyCode: 37
      };
    }

    this.setupKeyboardNavigation();

    Photoport.instances.push(this);
  }

  Photoport.instances = [ ];

  Photoport.prototype = {
    destroy: function () {
      Photoport.instances.splice(Photoport.instances.indexOf(this), 1);
      this.dom.root.remove();
      this.__onDestroy__.forEach(function (cb) {
        cb.bind(this)();
      });
    },
    onDestroy: function (cb) {
      this.__onDestroy__.push(cb);
    },
    fit: function (content) {
      el = content.el || this.current.el;

      var bounds = this.portRect();

      el.style.width  = bounds.width  + 'px';
      el.style.height = bounds.height + 'px';

      return this;
    },
    portRect: function () {
      return this.dom.port.getBoundingClientRect();
    },
    el: function () {
      return this.dom.root;
    },
    fitContent: function () {
      var bounds = this.portRect();
      var dimension = this.navigation.dimension;
      this.dom.content.style[dimension] = (this.count() * bounds[dimension]) + 'px';
      for(var i = this.count() - 1; i >= 0; i--) {
        this.fit(this.sequence[i]);
      }
      if (this.interludeContent) {
        this.fit(this.interludeContent);
      }
    },
    subsume: function (contentDescriptor) {
      contentDescriptor.el = contentDescriptor.el || div('photo');

      var style = contentDescriptor.el.style;

      style.display  = 'inline-block';
      style.position = 'relative';
      style.top      = 0;
      style.left     = 0;
      style.margin   = 0;
      style.border   = 'none';
      style.padding  = 0;
      style.outline  = 0;
      style.cursor   = 'default';

      if (!contentDescriptor.el.classList.contains('photoport-element')) {
        contentDescriptor.el.classList.add('photoport-element');
      }

      contentDescriptor.loadDeferred = new Photoport.Deferred();

      if ((typeof contentDescriptor.backgroundImage) === 'string') {
        if (!contentDescriptor.el.classList.contains('photoport-photo')) {
          contentDescriptor.el.classList.add('photoport-photo');
        }

        contentDescriptor.el.style.backgroundImage = "url(" + contentDescriptor.backgroundImage + ")";
        contentDescriptor.el.style.backgroundRepeat = "no-repeat";
        contentDescriptor.el.style.backgroundPosition = "center, 0 0";

        contentDescriptor.image = new Image();
        contentDescriptor.image.src = contentDescriptor.backgroundImage;

        var onLoad = function () {
          contentDescriptor.image.removeEventListener('load', onLoad);
          contentDescriptor.loadDeferred.resolve();
        }.bind(this);

        contentDescriptor.image.addEventListener('load', onLoad);
      }

      this.resizeContent(contentDescriptor);

      return this;
    },
    append: function (contentDescriptor) {
      return this.insert(contentDescriptor);
    },
    prepend: function (contentDescriptor) {
      return this.insert(contentDescriptor, 0);
    },
    insert: function (contentDescriptor, position) {
      if (position === undefined || position === null) {
        position = this.count();
      }

      if (typeof position === 'string') {
        position = this.indexForNamedPosition(position);
      }

      position = Math.min(position, this.count());

      if (position < 0) {
        position = Math.max(position + this.count(), 0);
      }

      if (this.position !== null && position < this.position) {
        this.position++;
        this.dom.content.style.transitionDuration = 0;
        this.dom.content.style[this.navigation.coordinate] = -1 * this.position * this.portRect()[this.navigation.dimension] + 'px';
        setTimeout(function () { this.dom.content.style.transitionDuration = ''; }.bind(this), 0);
        // we want the transitionDuration to be restored on the next tick; allow the dom to be updated
      }

      this.subsume(contentDescriptor);

      this.sequence.splice(position, 0, contentDescriptor);
      this.fit(contentDescriptor);

      var existingContent = this.dom.content;

      for (var i = 0; i < existingContent.children.length + 1; i++) {
        if (i === position) {
          existingContent.insertBefore(contentDescriptor.el, existingContent.children[i] || null);
          break;
        }
      }

      this.fitContent();

      this.setupMouseInteraction(contentDescriptor);

      var deferred = new Photoport.Deferred();

      setTimeout(deferred.resolve.bind(deferred), 0);

      this.el().dispatchEvent(new CustomEvent('photoport-content-insert', {
        bubbles: true,
        detail: {
          content: contentDescriptor,
          position: position,
          deferred: deferred
        }
      }));

      return deferred;
    },
    remove: function (contentToRemove) {
      var index = this.sequence.indexOf(contentToRemove);
      var deferred;
      var removedFirstItem = false;

      if (index === -1) {
        deferred = new Photoport.Deferred();
        setTimeout(deferred.resolve.bind(deferred), 0);
        return deferred;
      }

      if (index < this.position) {
        this.position = decr(this.position);
      } else if (index === this.position) {
        if (this.count() === 1) {
          this.position = null;
        } else {
          if (this.position === 0) {
            removedFirstItem = true;
            deferred = this.seek(1);
          } else {
            deferred = this.seek(decr(this.position));
          }
        }
      }

      this.sequence.splice(index, 1);
      contentToRemove.el.removeEventListener('mousedown', contentToRemove.mousedownHandler);

      if (deferred === undefined) {
        deferred = new Photoport.Deferred();
        setTimeout(deferred.resolve.bind(deferred), 0);
      }

      deferred.done(function () {
        if(removedFirstItem) {
          this.dom.content.style.transitionDuration = 0;
          this.dom.content.style[this.navigation.coordinate] = 0;
          this.dom.content.removeChild(contentToRemove.el);
          // we want the transitionDuration to be restored on the next tick; allow the dom to be updated
          setTimeout(function () { this.dom.content.style.transitionDuration = ''; }.bind(this), 0);
          this.position = 0;
        } else {
          this.dom.content.removeChild(contentToRemove.el);
        }
        this.fitContent();
      }.bind(this));

      this.el().dispatchEvent(new CustomEvent('photoport-content-remove', {
        bubbles: true,
        detail: {
          content: contentToRemove,
          deferred: deferred
        }
      }));

      return deferred;
    },
    start: function () {
      this.fitContent();

      if (this.position === null) {
        return this.seek(0);
      }

      return this.seek(this.position);
    },
    previous: function () {
      return this.seek(this.position - 1);
    },
    next: function () {
      return this.seek(this.position + 1);
    },
    seek: function (newPosition) {
      if (this.count() === 0) {
        throw new Error('Nothing added to Photoport');
      }

      if (typeof newPosition === 'string') {
        newPosition = this.indexForNamedPosition(newPosition);
      }

      var direction = newPosition > this.position ? 'Forwards' : 'Backwards';
      var bounce = false;

      if (newPosition >= this.count()) {
        bounce = true;
        newPosition = this.count() - 1;
      } else if (newPosition < 0) {
        bounce = true;
        newPosition = 0;
      }

      var deferred = new Photoport.Deferred();

      var onAnimationEnd = function () {
        this.dom.content.removeEventListener('webkitAnimationEnd', onAnimationEnd);
        this.dom.content.removeEventListener('webkitTransitionEnd', onAnimationEnd);
        deferred.resolve();
      }.bind(this);

      if (bounce) {
        this.dom.content.addEventListener('webkitAnimationEnd', onAnimationEnd);
        this['bounce' + direction]();
      } else {
        this.dom.content.addEventListener('webkitTransitionEnd', onAnimationEnd);
      }

      var newCoordinate = -1 * newPosition * this.portRect()[this.navigation.dimension];
      this.dom.content.style[this.navigation.coordinate] = newCoordinate + 'px';

      var previousPosition = this.position;
      this.position = newPosition;

      if (newPosition === previousPosition) {
        setTimeout(deferred.resolve.bind(deferred), 0);
      }

      if ('current' in this) {
        this.current.el.classList.remove('current');
      }
      this.current = this.sequence[this.position];
      this.current.el.classList.add('current');

      this.el().dispatchEvent(new CustomEvent('photoport-navigate', {
        bubbles: true,
        detail: {
          previousPosition: previousPosition,
          newPosition: newPosition,
          deferred: deferred
        }
      }));

      return deferred;
    },
    interlude: function (contentDescriptor) {
      var dom = this.dom;
      this.subsume(contentDescriptor);

      while(dom.interlude.hasChildNodes()) {
        dom.interlude.removeChild(dom.interlude.firstChild);
      }

      dom.interlude.style.display = '';
      dom.interlude.style.position = 'absolute';
      dom.interlude.style.top = 0;
      dom.interlude.style.left = 0;
      dom.interlude.appendChild(contentDescriptor.el);
      this.fit(contentDescriptor);
      this.state = 'interlude';
      this.interludeContent = contentDescriptor;
      return this;
    },
    resume: function () {
      var dom = this.dom;

      while(dom.interlude.hasChildNodes()) {
        dom.interlude.removeChild(dom.interlude.firstChild);
      }

      dom.interlude.style.display = 'none';
      this.state = 'normal';
      this.interludeContent = null;
      return this;
    },
    count: function () {
      return this.sequence.length;
    },
    createBounceKeyframes: function (name, start, direction) {
      var stops = [[0,0], [25,35], [50,50], [75,35], [100,0]];

      var keyframes = '@-webkit-keyframes ' + name + ' {';
      var coordinate = this.navigation.coordinate;

      for (var i = 0; i < stops.length; i++) {
        var percentage = stops[i][0];
        var v = start + (direction * stops[i][1]);
        keyframes = keyframes + percentage + '%{ ' + coordinate + ': ' + v + 'px;}';
      }

      keyframes = keyframes + '}';

      return keyframes;
    },
    bounceBackwards: function () {
      var name = 'photoportBounceBackwards-' + (new Date().valueOf());
      this.dom.keyframes.innerHTML = this.createBounceKeyframes(name, 0, 1);
      this.dom.content.style.webkitAnimation = name + ' 250ms linear';
    },
    bounceForwards: function () {
      var name = 'photoportBounceForwards-' + (new Date().valueOf());
      var start = parseInt(this.dom.content.style[this.navigation.coordinate], 10);
      this.dom.keyframes.innerHTML = this.createBounceKeyframes(name, start, -1);
      this.dom.content.style.webkitAnimation = name + ' 250ms linear';
    },
    keyboardNavigation: function (options) {
      if (options) {
        this.options.keyboardNavigationEnabled = options.enabled;
      }

      return this.options.keyboardNavigationEnabled;
    },
    setupKeyboardNavigation: function () {
      var disableKeydown = function () {
        window.removeEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);
      };

      var enableKeydown = function () {
        window.removeEventListener('keyup', keyup);
        window.addEventListener('keydown', keydown);
      };

      var throttleTimeoutId;

      var throttle = function () {
        if (throttleTimeoutId) clearTimeout(throttleTimeoutId);
        throttleTimeoutId = setTimeout(function () {
          enableKeydown();
        }, 500);
      }

      var keydown = function (event) {
        if (!this.options.keyboardNavigationEnabled) return;

        disableKeydown();
        throttle();
        if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) return;

        if (event.keyCode === this.navigation.nextKeyCode) {
          this.next();
        } else if (event.keyCode === this.navigation.previousKeyCode) {
          this.previous();
        }
      }.bind(this);

      var keyup = function (event) {
        if (!this.options.keyboardNavigationEnabled) return;
        if (throttleTimeoutId) clearTimeout(throttleTimeoutId);
        enableKeydown();
      }.bind(this)

      var removeKeyEventListeners = function () {
        window.removeEventListener('keydown', keydown);
        window.removeEventListener('keyup', keyup);
      }

      var addKeyEventListeners = function () {
        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);
      }

      addKeyEventListeners();
      this.onDestroy(removeKeyEventListeners);
    },
    setupMouseInteraction: function (contentDescriptor) {
      var photoport = this;
      contentDescriptor.mousedownHandler = function (e) {

        var timeout = setTimeout(function () {
          contentDescriptor.el.removeEventListener('mouseup', mouseupHandler);

          photoport.el().dispatchEvent(new CustomEvent('photoport-content-hold', {
            bubbles: true,
            detail: {
              content: contentDescriptor
            }
          }));
        }, 350);

        var mouseupHandler = function (e) {
          e.preventDefault();
          e.stopPropagation();

          contentDescriptor.el.removeEventListener('mouseup', mouseupHandler);
          clearTimeout(timeout);

          photoport.el().dispatchEvent(new CustomEvent('photoport-content-action', {
            bubbles: true,
            detail: {
              content: contentDescriptor
            }
          }));
        };

        contentDescriptor.el.addEventListener('mouseup', mouseupHandler);
      };

      contentDescriptor.el.addEventListener('mousedown', contentDescriptor.mousedownHandler);
    },
    indexForNamedPosition: function (position) {
      switch(position) {
        case 'last':
          return this.count() - 1;
        case 'first':
          return 0;
        default:
          return position;
      }
    },
    resize: function (dimensions) {
      this.sequence.map(function (contentDescriptor) {
        return contentDescriptor.el;
      }).concat([
        this.dom.root,
        this.dom.port
      ]).forEach(function (el) {
        el.style.width  = dimensions.width + 'px';
        el.style.height = dimensions.height + 'px';
      });

      var dimension = this.navigation.dimension;

      this.dom.content.style[dimension] = (this.count() * this.portRect()[dimension]) + 'px';
      this.dom.content.style[this.navigation.coordinate] = -1 * this.position * this.portRect()[dimension] + 'px';

      this.sequence.forEach(this.resizeContent.bind(this));
    },
    resizeContent: function (contentDescriptor) {
      if (!contentDescriptor.el.classList.contains('photo')) return;

      contentDescriptor.loadDeferred.done(function () {
        var image = contentDescriptor.image;
        var imageAspectRatio = image.width / image.height;
        var portRect = this.portRect();
        var portAspectRatio = portRect.width / portRect.height;

        if (imageAspectRatio >= portAspectRatio) {
          var imageHeight = portRect.height;
          var imageWidth = imageAspectRatio * imageHeight;
        } else {
          var imageWidth = portRect.width;
          var imageHeight = imageWidth / imageAspectRatio;
        }

        contentDescriptor.el.style.backgroundSize = imageWidth + "px " + imageHeight + "px";
      }.bind(this));
    }
  };

  return Photoport;
})();
