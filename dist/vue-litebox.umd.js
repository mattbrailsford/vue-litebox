(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.VueLitebox = {})));
}(this, (function (exports) { 'use strict';

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //


    // A short delay between navigation triggers to give the UI 
    // time to update things such as clearing iframes and removing
    // animation classes
    var navDelay = 100;

    var script = {
        name: 'VueLitebox',
        props: {
            items: {
                type: Array,
                required: true
            },
            startAt: {
                type: Number,
                default: 0
            },
            closeCaption: {
                default: 'Close'
            },
            prevCaption: {
                default: 'Previous'
            },
            nextCaption: {
                default: 'Next'
            },
            loadingCaption: {
                default: 'Loading...'
            },
            videoRegex: {
                default: function () { return /youtube.com|vimeo.com/; }
            },
            closeOnEsc: {
                default: true
            },
            nextOnImageClick: {
                default: true
            }
        },
        data: function data() {
            var self = this;
            return {
                loading: true,
                navDelayed: false,
                direction: 'init',
                currentItemIndex: self.startAt,
                closeProps: {
                    class: 'vlb-close'
                },
                closeEvents: {
                    click: function click(e) {
                        e.preventDefault();
                        self.close();
                    }
                },
                prevProps: {
                    class: 'vlb-arrow vlb-arrow--prev'
                },
                prevEvents: {
                    click: function click(e) {
                        e.preventDefault();
                        self.prev();
                    }
                },
                nextProps: {
                    class: 'vlb-arrow vlb-arrow--next'
                },
                nextEvents: {
                    click: function click(e) {
                        e.preventDefault();
                        self.next();
                    }
                },
                captionProps: {
                    class: 'vlb-caption'
                }
            }
        },
        computed: {
            currentItem: function currentItem() {
                return this.items[this.currentItemIndex];
            },
            currentItemUrl: function currentItemUrl() {
                return typeof this.currentItem === 'string' ? this.currentItem : this.currentItem.src;
            },
            directionClass: function directionClass() {
                if (this.loading || this.navDelayed) { return ''; }
                return 'vlb-direction-' + this.direction;
            }
        },
        methods: {
            _isVideo: function _isVideo(url) {
                return this.videoRegex.test(url);
            },
            _wrapIndex: function _wrapIndex(idx) {
                if (idx >= this.items.length) {
                    idx = 0;
                } else if (idx < 0) {
                    idx = this.items.length - 1;
                }
                return idx;
            },
            _loaded: function _loaded() {
                this.loading = false;
            },
            _imageClick: function _imageClick() {
                if (this.nextOnImageClick) {
                    this.next();
                }
            },
            close: function close() {
                this.$emit('close');
            },
            prev: function prev() {
                var self = this;
                self.navDelayed = true;
                setTimeout(function () {
                    var targetIndex = self.currentItemIndex - 1;
                    var nextIndex = self._wrapIndex(targetIndex);
                    self.direction = (nextIndex != targetIndex ? 'wrap-' : '') + 'prev';
                    self.currentItemIndex = nextIndex;
                    self.navDelayed = false;
                }, navDelay);
            },
            next: function next() {
                var self = this;
                self.navDelayed = true;
                setTimeout(function () {
                    var targetIndex = self.currentItemIndex + 1;
                    var nextIndex = self._wrapIndex(targetIndex);
                    self.direction = (nextIndex != targetIndex ? 'wrap-' : '') + 'next';
                    self.currentItemIndex = nextIndex;
                    self.navDelayed = false;
                }, navDelay);
            },
            gotTo: function gotTo(idx) {
                var self = this;
                self.navDelayed = true;
                setTimeout(function () {
                    var nextIndex = self._wrapIndex(idx);
                    self.direction = nextIndex > self.currentItemIndex ? 'next' : 'prev';
                    self.currentItemIndex = nextIndex;
                    self.navDelayed = false;
                }, navDelay);
            }
        },
        watch: {
            currentItemUrl: function currentItemUrl(newValue) {
                if (newValue) {
                    this.loading = true;
                }
            }
        },
        mounted: function mounted() {

            var self = this;

            var keyHandler = function (e) {
                self.closeOnEsc && e.keyCode === 27 && self.close();
                if (self.items.length > 1) {
                    (e.keyCode === 39 || e.keyCode === 68) && self.next();
                    (e.keyCode === 37 || e.keyCode === 65) && self.prev();
                }
            };

            document.addEventListener('keydown', keyHandler);
            self.$once('hook:beforeDestroy', function () {
                document.removeEventListener('keydown', keyHandler);
            });
        }
    };

    /* script */
                var __vue_script__ = script;
    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "vlb-element",
          class: { "vlb-element--loading": _vm.navDelayed || _vm.loading },
          on: { click: _vm.close }
        },
        [
          _c("div", { staticClass: "vlb-overlay" }),
          _vm._v(" "),
          _c("div", { staticClass: "vlb-wrapper-outer" }, [
            _c("div", { staticClass: "vlb-wrapper-inner" }, [
              _c(
                "div",
                {
                  staticClass: "vlb-content",
                  class: _vm.directionClass,
                  on: {
                    click: function($event) {
                      $event.stopPropagation();
                    }
                  }
                },
                [
                  !_vm.loading && !_vm.navDelayed
                    ? _c(
                        "div",
                        { staticClass: "vlb-close-wrapper" },
                        [
                          _vm._t(
                            "close",
                            [
                              _c(
                                "button",
                                _vm._g(
                                  _vm._b(
                                    {
                                      attrs: {
                                        type: "button",
                                        title: _vm.closeCaption
                                      }
                                    },
                                    "button",
                                    _vm.closeProps,
                                    false
                                  ),
                                  _vm.closeEvents
                                ),
                                [_vm._v("x")]
                              )
                            ],
                            {
                              closeProps: _vm.closeProps,
                              closeEvents: _vm.closeEvents
                            }
                          )
                        ],
                        2
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "figure",
                    { staticClass: "vlb-figure" },
                    [
                      _vm.navDelayed || _vm.loading
                        ? _c(
                            "div",
                            { staticClass: "vlb-loading" },
                            [
                              _vm._t("loading", [
                                _vm._v(_vm._s(_vm.loadingCaption))
                              ])
                            ],
                            2
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      !_vm.navDelayed &&
                      _vm.currentItem &&
                      !_vm._isVideo(_vm.currentItemUrl)
                        ? _c(
                            "div",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: !_vm.loading,
                                  expression: "!loading"
                                }
                              ],
                              staticClass: "vlb-image-wrapper"
                            },
                            [
                              _c("img", {
                                staticClass: "vlb-image",
                                attrs: { src: _vm.currentItemUrl },
                                on: { load: _vm._loaded, click: _vm._imageClick }
                              })
                            ]
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      !_vm.navDelayed &&
                      _vm.currentItem &&
                      _vm._isVideo(_vm.currentItemUrl)
                        ? _c(
                            "div",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: !_vm.loading,
                                  expression: "!loading"
                                }
                              ],
                              staticClass: "vlb-frame-wrapper"
                            },
                            [
                              _c("div", { staticClass: "vlb-frame-sizer" }, [
                                _c("iframe", {
                                  staticClass: "vlb-frame",
                                  attrs: {
                                    frameborder: "0",
                                    allowfullscreen: "",
                                    src: _vm.currentItemUrl
                                  },
                                  on: { load: _vm._loaded }
                                })
                              ])
                            ]
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.currentItem && !_vm.loading && !_vm.navDelayed
                        ? _vm._t(
                            "caption",
                            [
                              _c(
                                "figcaption",
                                _vm._b({}, "figcaption", _vm.captionProps, false),
                                [
                                  _vm.currentItem.title
                                    ? _c(
                                        "div",
                                        { staticClass: "vlb-caption-title" },
                                        [_vm._v(_vm._s(_vm.currentItem.title))]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "vlb-caption-count" }, [
                                    _vm._v(
                                      _vm._s(_vm.currentItemIndex + 1) +
                                        "/" +
                                        _vm._s(_vm.items.length)
                                    )
                                  ])
                                ]
                              )
                            ],
                            {
                              captionProps: _vm.captionProps,
                              currentItem: _vm.currentItem,
                              currentItemIndex: _vm.currentItemIndex,
                              totalItems: _vm.items.length
                            }
                          )
                        : _vm._e()
                    ],
                    2
                  )
                ]
              ),
              _vm._v(" "),
              _vm.items.length > 1
                ? _c(
                    "div",
                    { staticClass: "vlb-arrows" },
                    [
                      _vm._t(
                        "prev",
                        [
                          _c(
                            "button",
                            _vm._g(
                              _vm._b(
                                {
                                  attrs: { type: "button", title: _vm.prevCaption }
                                },
                                "button",
                                _vm.prevProps,
                                false
                              ),
                              _vm.prevEvents
                            ),
                            [_vm._v("<")]
                          )
                        ],
                        { prevProps: _vm.prevProps, prevEvents: _vm.prevEvents }
                      ),
                      _vm._v(" "),
                      _vm._t(
                        "next",
                        [
                          _c(
                            "button",
                            _vm._g(
                              _vm._b(
                                {
                                  attrs: { type: "button", title: _vm.nextCaption }
                                },
                                "button",
                                _vm.nextProps,
                                false
                              ),
                              _vm.nextEvents
                            ),
                            [_vm._v(">")]
                          )
                        ],
                        { nextProps: _vm.nextProps, nextEvents: _vm.nextEvents }
                      )
                    ],
                    2
                  )
                : _vm._e()
            ])
          ])
        ]
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      var __vue_inject_styles__ = undefined;
      /* scoped */
      var __vue_scope_id__ = undefined;
      /* module identifier */
      var __vue_module_identifier__ = undefined;
      /* functional template */
      var __vue_is_functional_template__ = false;
      /* component normalizer */
      function __vue_normalize__(
        template, style, script$$1,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

        // For security concerns, we use only base name in production mode.
        component.__file = "C:\\Users\\Matt\\Work\\VueLitebox\\src\\vue-litebox.vue";

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var component = __vue_normalize__(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        __vue_create_injector__,
        undefined
      );

    // Import vue component

    // Declare install function executed by Vue.use()
    function install(Vue) {
    	if (install.installed) { return; }
    	install.installed = true;
    	Vue.component('VueLitebox', component);
    }

    // Create module definition for Vue.use()
    var plugin = {
    	install: install,
    };

    // Auto-install when vue is found (eg. in browser via <script> tag)
    var GlobalVue = null;
    if (typeof window !== 'undefined') {
    	GlobalVue = window.Vue;
    } else if (typeof global !== 'undefined') {
    	GlobalVue = global.Vue;
    }
    if (GlobalVue) {
    	GlobalVue.use(plugin);
    }

    exports.install = install;
    exports.default = component;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
