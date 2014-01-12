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
      leftHandle        : div('photoport-handle photoport-handle-left'),
      rightHandle       : div('photoport-handle photoport-handle-right'),
      leftHandleGlyph   : span('fui-triangle-left-large photoport-handle-glyph'),
      rightHandleGlyph  : span('fui-triangle-right-large photoport-handle-glyph'),
      keyframes         : document.createElement('STYLE')
    };

    dom.root.appendChild(dom.leftHandle);
    dom.root.appendChild(dom.port);
    dom.root.appendChild(dom.rightHandle);
    dom.port.appendChild(dom.content);
    dom.port.appendChild(dom.interlude);
    dom.root.appendChild(dom.keyframes);

    dom.leftHandle.appendChild(dom.leftHandleGlyph);
    dom.rightHandle.appendChild(dom.rightHandleGlyph);

    dom.interlude.style.display = 'none';
    dom.keyframes.classList.add('photoport-bounce-keyframes');
    return dom;
  }

  function decr(p) {
    return Math.max(p - 1, 0);
  }

  function createBounceKeyframes(name, start, direction) {
    var stops = [[0,0], [25,10], [50,50], [75,10], [100,0]];

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
    this.container = options.container;
    this.dom = build();
    this.container.appendChild(this.dom.root);
    this.sequence = [];
    this.position = null;
    this.state = 'normal';
    this.interludeContent = null;

    this.dom.rightHandle.addEventListener('click', function (e) {
      e.preventDefault();
      this.next();
    }.bind(this));

    this.dom.leftHandle.addEventListener('click', function (e) {
      e.preventDefault();
      this.previous();
    }.bind(this));

    this.dom.content.addEventListener('animationend', function () {
      this.dom.content.style.webkitAnimation = '';
    }.bind(this));
  }

  Photoport.prototype = {
    fit: function (content) {
      el = content.el || this.current.el;

      var bounds = this.portRect();

      el.style.width    = bounds.width  + 'px';
      el.style.height   = bounds.height + 'px';

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
    showHandles: function () {
      var dom       = this.dom;
      dom.leftHandle.style.display  = 'table';
      dom.rightHandle.style.display = 'table';
    },
    hideHandles: function () {
      var dom       = this.dom;
      dom.leftHandle.style.display  = 'none';
      dom.rightHandle.style.display = 'none';
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

      position = Math.min(position, this.sequence.length);

      if (position < 0) {
        position = Math.max(position + this.sequence.length, 0);
      }

      if (this.position !== null && position <= this.position) {
        this.position++;
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

      this.el().dispatchEvent(new CustomEvent('photoport-content-insert', {
        bubbles: true,
        detail: {
          content: contentDescriptor,
          position: position
        }
      }));

      return this;
    },
    remove: function (content) {
      var index = this.sequence.indexOf(content);
      if (index === -1) return this;

      if (index < this.position) {
        this.position = decr(this.position);
      } else if (index === this.position) {
        if (this.sequence.length === 1) {
          this.position = null;
        } else {
          this.seek(decr(this.position));
        }
      }

      this.sequence.splice(index, 1);
      this.dom.content.removeChild(content.el);
      this.fitContent();

      content.el.removeEventListener('mousedown', content.mousedownHandler);

      this.el().dispatchEvent(new CustomEvent('photoport-content-remove', {
        bubbles: true,
        detail: {
          content: content
        }
      }));
      return this;
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
      if (this.sequence.length === 0) {
        throw new Error('Nothing added to Photoport');
      }

      switch(newPosition) {
        case 'last':
          newPosition = this.sequence.length - 1;
          break;
        case 'first':
          newPosition = 0;
          break;
      }

      if (newPosition >= this.sequence.length) {
        newPosition = this.sequence.length - 1;
      } else if (newPosition < 0) {
        newPosition = 0;
      }

      if (this.position === newPosition) {
        switch (this.position) {
          case 0:
            this.bounceLeft();
            break;
          case this.sequence.length - 1:
            this.bounceRight();
            break;
        }
      }

      var newLeft = -1 * newPosition * this.portRect().width;

      this.dom.content.style.left = newLeft + 'px';
      var previousPosition = this.position;
      this.position = newPosition;
      this.current = this.sequence[this.position];
      this.el().dispatchEvent(new CustomEvent('photoport-navigate', {
        bubbles: true,
        detail: {
          previousPosition: previousPosition,
          newPosition: newPosition
        }
      }));

      return this;
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
      this.hideHandles();
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
      this.showHandles();
      return this;
    },
    count: function () {
      return this.sequence.length;
    },
    bounceLeft: function () {
      var name = 'photoportBounceLeft-' + (new Date().valueOf());
      this.dom.keyframes.innerHTML = createBounceKeyframes(name, 0, 1);
      this.dom.content.style.webkitAnimation = name + ' 350ms linear';
    },
    bounceRight: function () {
      var name = 'photoportBounceRight-' + (new Date().valueOf());
      var start = parseInt(this.dom.content.style.left, 10);
      this.dom.keyframes.innerHTML = createBounceKeyframes(name, start, -1);
      this.dom.content.style.webkitAnimation = name + ' 350ms linear';
    },
  };

  return Photoport;
})();
