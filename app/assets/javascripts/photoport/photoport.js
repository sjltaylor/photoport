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

  function build () {
    var dom = {
      root        : div('photoport'),
      port        : div('photoport-port'),
      content     : div('content'),
      leftHandle  : div('photoport-handle photoport-handle-left'),
      rightHandle : div('photoport-handle photoport-handle-right')
    };

    dom.root.appendChild(dom.leftHandle);
    dom.root.appendChild(dom.port);
    dom.root.appendChild(dom.rightHandle);
    dom.port.appendChild(dom.content);

    return dom;
  }

  function Photoport (options) {
    checkOptions(options);
    this.container = options.container;
    this.dom = build();
    this.container.appendChild(this.dom.root);
    this.sequence = [];
    this.position = null;

    this.dom.rightHandle.addEventListener('click', function (e) {
      e.preventDefault();
      this.next();
    }.bind(this));
  }

  Photoport.prototype = {
    fit: function (el) {
      var bounds = this.dom.content.getBoundingClientRect();

      el.style.width  = bounds.width  + 'px';
      el.style.height = bounds.height + 'px';

      if (!el.classList.contains('photoport-element')) {
        el.classList.add('photoport-element');
      }
    },
    append: function (imgUrlOrHTMLElement) {
      return this.insert(imgUrlOrHTMLElement);
    },
    prepend: function (imgUrlOrHTMLElement) {
      return this.insert(imgUrlOrHTMLElement, 0);
    },
    insert: function (imgUrlOrHTMLElement, position) {
      if (position === undefined || position === null) {
        position = this.sequence.length;
      }

      var e = imgUrlOrHTMLElement;

      if ((typeof e) === 'string') {
        e = div('photo');
        e.style.backgroundImage = "url(" + imgUrlOrHTMLElement + ")";
        e.style.backgroundRepeat = "no-repeat";
      }

      this.sequence.splice(position, 0, e);

      if (position <= this.position) {
        this.__incrementPosition__();
      }

      return this;
    },
    start: function () {
      return this.seek(0);
    },
    __incrementPosition__: function () {
      this.position++;
      this.position = this.position % this.sequence.length;
    },
    next: function () {
      return this.seek(this.position + 1);
    },
    seek: function (position) {
      if (this.sequence.length === 0) {
        throw new Error('Nothing added to Photoport');
      }
      //this.__incrementPosition__();

      var content = this.dom.content;

      while (content.hasChildNodes()) {
        content.removeChild(content.lastChild);
      }

      position = position % this.sequence.length;

      this.position = position;
      this.current = this.sequence[position];

      this.fit(this.current);

      content.appendChild(this.current);
      return this;
    },
    teardown: function () {
      // remove all of the dom
      // remove all event handlers
    }
  };

  return Photoport;
})();
