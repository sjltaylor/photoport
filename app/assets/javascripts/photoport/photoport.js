//= require_self
//= require photoport/photoport.deferred
//= require photoport/photoport.touch

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
      root              : div('photoport'),
      port              : div('photoport-port'),
      content           : div('photoport-content'),
      interlude         : div('photoport-interlude'),
      keyframes         : document.createElement('STYLE')
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

  function createBounceKeyframes(name, start, direction) {
    var stops = [[0,0], [25,35], [50,50], [75,35], [100,0]];

    var keyframes = '@-webkit-keyframes ' + name + ' {';

    for (var i = 0; i < stops.length; i++) {
      var percentage = stops[i][0];
      var left = start + (direction * stops[i][1]);
      keyframes = keyframes + percentage + '%{ left: ' + left + 'px;}';
    }

    keyframes = keyframes + '}';

    return keyframes;
  }

  function Photoport (options) {
    checkOptions(options);
    this.options = options;

    this.container = options.container;
    this.dom = build();
    this.container.appendChild(this.dom.root);
    this.sequence = [];
    this.position = null;
    this.state = 'normal';
    this.interludeContent = null;

    this.dom.content.addEventListener('webkitAnimationEnd', function () {
      this.dom.content.style.webkitAnimation = '';
      this.dom.keyframes.innerHTML = '';
    }.bind(this));

    this.setupKeyboardNavigation();
    this.setupTouchInteraction();
    this.__keyboardEventListener__ = this.__keyboardEventListener__.bind(this);

    Photoport.instances.push(this);
  }

  Photoport.instances = [ ];

  Photoport.prototype = {
    destroy: function () {
      Photoport.instances.splice(Photoport.instances.indexOf(this), 1);
      this.dom.root.remove();
      window.removeEventListener('keydown', this.__keyboardEventListener__);
      window.removeEventListener('mousedown', this.__mouseDownEventListener__);
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
      this.dom.content.style.width = (this.sequence.length * bounds.width) + 'px';
      for(var i = this.sequence.length - 1; i >= 0; i--) {
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

      if ((typeof contentDescriptor.backgroundImage) === 'string') {
        if (!contentDescriptor.el.classList.contains('photoport-photo')) {
          contentDescriptor.el.classList.add('photoport-photo');
        }

        contentDescriptor.el.style.backgroundImage = "url(" + contentDescriptor.backgroundImage + ")";
        contentDescriptor.el.style.backgroundRepeat = "no-repeat";
      }

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
        position = this.sequence.length;
      }

      if (typeof position === 'string') {
        position = this.indexForNamedPosition(position);
      }

      position = Math.min(position, this.sequence.length);

      if (position < 0) {
        position = Math.max(position + this.sequence.length, 0);
      }

      if (this.position !== null && position < this.position) {
        this.position++;
        this.dom.content.style.transitionDuration = 0;
        this.dom.content.style.left = -1 * this.position * this.portRect().width + 'px';
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

      Photoport.touch(contentDescriptor.el);

      contentDescriptor.el.addEventListener('hold', function (event) {
        this.el().dispatchEvent(new CustomEvent('photoport-content-hold', {
          bubbles: true,
          detail: {
            content: contentDescriptor
          }
        }));
      }.bind(this));

      contentDescriptor.el.addEventListener('tap', function (event) {
        this.el().dispatchEvent(new CustomEvent('photoport-content-action', {
          bubbles: true,
          detail: {
            content: contentDescriptor
          }
        }));
      }.bind(this));



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
        if (this.sequence.length === 1) {
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
          this.dom.content.style.left = 0;
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
    hasPrevious: function () {
      return this.position > 0;
    },
    previous: function () {
      return this.seek(this.position - 1);
    },
    hasNext: function () {
      return this.position < this.count();
    },
    next: function () {
      return this.seek(this.position + 1);
    },
    seek: function (newPosition) {
      if (this.sequence.length === 0) {
        throw new Error('Nothing added to Photoport');
      }

      if (typeof newPosition === 'string') {
        newPosition = this.indexForNamedPosition(newPosition);
      }

      var direction = newPosition > this.position ? 'Right' : 'Left';
      var bounce = false;

      if (newPosition >= this.sequence.length) {
        bounce = true;
        newPosition = this.sequence.length - 1;
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

      var newLeft = -1 * newPosition * this.portRect().width;
      this.dom.content.style.left = newLeft + 'px';

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
    bounceLeft: function () {
      var name = 'photoportBounceLeft-' + (new Date().valueOf());
      this.dom.keyframes.innerHTML = createBounceKeyframes(name, 0, 1);
      this.dom.content.style.webkitAnimation = name + ' 250ms linear';
    },
    bounceRight: function () {
      var name = 'photoportBounceRight-' + (new Date().valueOf());
      var start = parseInt(this.dom.content.style.left, 10);
      this.dom.keyframes.innerHTML = createBounceKeyframes(name, start, -1);
      this.dom.content.style.webkitAnimation = name + ' 250ms linear';
    },
    __keyboardEventListener__: function (event) {
      if (this.options.keyboardNavigation) {
        if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) return;
        if (event.keyCode === 39) this.next();
        else if (event.keyCode === 37) this.previous();
      }
    },
    setupKeyboardNavigation: function () {
      this.__keyboardEventListener__ = this.__keyboardEventListener__.bind(this);
      window.addEventListener('keydown', this.__keyboardEventListener__);
    },
    setupTouchInteraction: function () {
      var content = this.dom.content;

      this.__mouseDownEventListener__ = function (event) {
        window.removeEventListener('keydown', this.__keyboardEventListener__);
        var positionDelta = 0;
        var shiftThreshold = 0.4;
        var width = this.portRect().width;
        var finished = false;

        var dragReferenceX, contentLeft, currentPosition;

        var start = function (event) {
          dragReferenceX = event.pageX;
          contentLeft = parseInt(content.style.left, 10);
          currentPosition = this.position;
        }.bind(this);

        start(event);

        var finish = function () {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', finish);
          finished = true;
          if (this.position === currentPosition) {
            var left = (-1 * this.position * width);
            this.dom.content.style.left = left + 'px';
          }
          this.setupKeyboardNavigation();
        }.bind(this);

        var onMouseMove = function (event) {
          var linearMovementX = event.pageX - dragReferenceX;
          var nonLinearMovementX = Math.round(0.68 * linearMovementX);
          var newLeft = contentLeft + nonLinearMovementX;

          if (positionDelta < 1 && nonLinearMovementX < 0) {
            content.style.left = newLeft + 'px';
          }

          if (positionDelta > -1 && nonLinearMovementX > 0) {
            content.style.left = newLeft + 'px';
          }

          var shift = linearMovementX / width;

          if (this.hasNext() && positionDelta < 1 && shift < -shiftThreshold) {
            positionDelta++;
            window.removeEventListener('mousemove', onMouseMove);
            this.next().done(function () {
              setTimeout(function () {
                start(event);
                if (!finished) window.addEventListener('mousemove', onMouseMove);
              }, 80);
            });
          } else if (this.hasPrevious() && positionDelta > -1 && shift > shiftThreshold) {
            positionDelta--;
            window.removeEventListener('mousemove', onMouseMove);
            this.previous().done(function () {
              setTimeout(function () {
                start(event);
                if (!finished) window.addEventListener('mousemove', onMouseMove);
              }, 80);
            });
          }
        }.bind(this);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', finish);
      }.bind(this);

      content.addEventListener('mousedown', this.__mouseDownEventListener__);
    },
    indexForNamedPosition: function (position) {
      switch(position) {
        case 'last':
          return this.sequence.length - 1;
        case 'first':
          return 0;
        default:
          return position;
      }
    },
    resize: function (dimensions) {
      //this.currentDimensions = dimensions;
      /*
        * .photoport
        * .photoport-content
      */
      var targets = this.sequence.map(function (contentDescriptor) {
        return contentDescriptor.el;
      }).concat([
        this.dom.root,
        this.dom.port
      ]).forEach(function (el) {
        el.style.width  = dimensions.width + 'px';
        el.style.height = dimensions.height + 'px';
      });

      this.dom.content.style.width = (this.sequence.length * this.portRect().width) + 'px';
      this.dom.content.style.left = -1 * this.position * this.portRect().width + 'px';
    }
  };

  return Photoport;
})();
