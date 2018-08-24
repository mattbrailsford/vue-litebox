<template>
    <div class="vlb-element" :class="{ 'vlb-element--loading': navDelayed || loading }" @click="close">
        <div class="vlb-overlay"></div>
        <div class="vlb-wrapper-outer">
            <div class="vlb-wrapper-inner">
                <div class="vlb-content" :class="directionClass" @click.stop>
                    <div class="vlb-close-wrapper" v-if="!loading && !navDelayed">
                        <slot name="close" :close-props="closeProps" :close-events="closeEvents">
                            <button type="button" :title="closeCaption" v-bind="closeProps" v-on="closeEvents">x</button>
                        </slot>
                    </div>
                    <figure class="vlb-figure">
                        <div class="vlb-loading" v-if="navDelayed || loading">
                            <slot name="loading">{{loadingCaption}}</slot>
                        </div>
                        <div v-if="!navDelayed && currentItem && !_isVideo(currentItemUrl)" v-show="!loading" class="vlb-image-wrapper" ><img class="vlb-image" :src="currentItemUrl" @load="_loaded" @click="_imageClick" /></div>
                        <div v-if="!navDelayed && currentItem && _isVideo(currentItemUrl)" v-show="!loading" class="vlb-frame-wrapper"><div class="vlb-frame-sizer"><iframe class="vlb-frame" frameborder="0" allowfullscreen :src="currentItemUrl" @load="_loaded"></iframe></div></div>
                        <slot v-if="currentItem && !loading && !navDelayed" name="caption" :caption-props="captionProps" :current-item="currentItem" :current-item-index="currentItemIndex" :total-items="items.length">
                            <figcaption v-bind="captionProps">
                                <div class="vlb-caption-title" v-if="currentItem.title">{{currentItem.title}}</div>
                                <div class="vlb-caption-count">{{currentItemIndex + 1}}/{{items.length}}</div>
                            </figcaption>
                        </slot>
                    </figure>
                </div>
                <div class="vlb-arrows" v-if="items.length > 1">
                    <slot name="prev" :prev-props="prevProps" :prev-events="prevEvents">
                        <button type="button" :title="prevCaption" v-bind="prevProps" v-on="prevEvents">&lt;</button>
                    </slot>
                    <slot name="next" :next-props="nextProps" :next-events="nextEvents">
                        <button type="button" :title="nextCaption" v-bind="nextProps" v-on="nextEvents">&gt;</button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

// A short delay between navigation triggers to give the UI 
// time to update things such as clearing iframes and removing
// animation classes
let navDelay = 100;

export default {
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
            default: () => /youtube.com|vimeo.com/
        },
        closeOnEsc: {
            default: true
        },
        nextOnImageClick: {
            default: true
        }
    },
    data() {
        let self = this;
        return {
            loading: true,
            navDelayed: false,
            direction: 'init',
            currentItemIndex: self.startAt,
            closeProps: {
                class: 'vlb-close'
            },
            closeEvents: {
                click(e) {
                    e.preventDefault();
                    self.close();
                }
            },
            prevProps: {
                class: 'vlb-arrow vlb-arrow--prev'
            },
            prevEvents: {
                click(e) {
                    e.preventDefault();
                    self.prev();
                }
            },
            nextProps: {
                class: 'vlb-arrow vlb-arrow--next'
            },
            nextEvents: {
                click(e) {
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
        currentItem() {
            return this.items[this.currentItemIndex];
        },
        currentItemUrl() {
            return typeof this.currentItem === 'string' ? this.currentItem : this.currentItem.src;
        },
        directionClass() {
            if (this.loading || this.navDelayed) return '';
            return 'vlb-direction-' + this.direction;
        }
    },
    methods: {
        _isVideo(url) {
            return this.videoRegex.test(url);
        },
        _wrapIndex(idx) {
            if (idx >= this.items.length) {
                idx = 0;
            } else if (idx < 0) {
                idx = this.items.length - 1;
            }
            return idx;
        },
        _loaded() {
            this.loading = false;
        },
        _imageClick() {
            if (this.nextOnImageClick) {
                this.next();
            }
        },
        close() {
            this.$emit('close');
        },
        prev() {
            let self = this;
            self.navDelayed = true;
            setTimeout(() => {
                let targetIndex = self.currentItemIndex - 1;
                let nextIndex = self._wrapIndex(targetIndex);
                self.direction = (nextIndex != targetIndex ? 'wrap-' : '') + 'prev';
                self.currentItemIndex = nextIndex;
                self.navDelayed = false;
            }, navDelay);
        },
        next() {
            let self = this;
            self.navDelayed = true;
            setTimeout(() => {
                let targetIndex = self.currentItemIndex + 1;
                let nextIndex = self._wrapIndex(targetIndex);
                self.direction = (nextIndex != targetIndex ? 'wrap-' : '') + 'next';
                self.currentItemIndex = nextIndex;
                self.navDelayed = false;
            }, navDelay);
        },
        gotTo(idx) {
            let self = this;
            self.navDelayed = true;
            setTimeout(() => {
                let nextIndex = self._wrapIndex(idx);
                self.direction = nextIndex > self.currentItemIndex ? 'next' : 'prev';
                self.currentItemIndex = nextIndex;
                self.navDelayed = false;
            }, navDelay);
        }
    },
    watch: {
        currentItemUrl(newValue) {
            if (newValue) {
                this.loading = true;
            }
        }
    },
    mounted() {

        let self = this;

        let keyHandler = (e) => {
            self.closeOnEsc && e.keyCode === 27 && self.close();
            if (self.items.length > 1) {
                (e.keyCode === 39 || e.keyCode === 68) && self.next();
                (e.keyCode === 37 || e.keyCode === 65) && self.prev();
            }
        }

        document.addEventListener('keydown', keyHandler);
        self.$once('hook:beforeDestroy', () => {
            document.removeEventListener('keydown', keyHandler);
        });
    }
}
</script>

<style>
  .vlb-element {
    box-sizing: border-box;
  }

  .vlb-element *, .vlb-element *:before, .vlb-element *:after {
    box-sizing: inherit;
  }

  .vlb-overlay, .vlb-wrapper-outer, .vlb-wrapper-inner {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .vlb-overlay {
    background-color: #000;
    opacity: 0.7;
    overflow: hidden;
    z-index: 2000;
  }

  .vlb-wrapper-outer {
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 2010;
  }

  .vlb-wrapper-inner {
    position: absolute;
    text-align: center;
  }

  .vlb-wrapper-inner:before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  .vlb-content {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin: 0px auto;
    text-align: left;
    max-width: 100%;
    z-index: 2020;
  }

  .vlb-figure {
    position: relative;
    padding: 0;
    margin: 0;
    z-index: 10;
  }

  .vlb-image {
    width: auto;
    max-width: 100%;
    height: auto;
    display: block;
    line-height: 0;
    margin: 0 auto;
  }

  .vlb-frame-wrapper {
    position: relative;
    width: 853px; /* Largest YouTube embed size */
    max-width: 100%;
  }

  .vlb-frame-sizer {
    position: relative;
    width: 100%;
    height: 0;
    overflow: hidden;
    padding-top: 56.25%;
  }

  .vlb-frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .vlb-caption {
    display: block;
  }

  .vlb-close-wrapper {
    position: relative;
    text-align: right;
    z-index: 20;
  }

  .vlb-arrows {
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
    z-index: 2030;
  }

  .vlb-close, .vlb-arrow {
    cursor: pointer;
  }

  .vlb-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    overflow: hidden;
  }

  .vlb-arrow--prev {
    left: 0;
  }

  .vlb-arrow--next {
    right: 0;
  }
</style>
