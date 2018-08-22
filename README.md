# vue-litebox
A lightweight, zero dependency lightbox implementation for vuejs

## Usage

````javascript
import VueLitebox from './VueLitebox.vue'

var app = new Vue({
  el: '#app',
  components: { VueLitebox },
  data: {
      images: [
          '/images/01.png',
          '/images/02.png',
          '/images/03.png'
      ],
      showLitebox: false
  },
  methods: {
      showLitebox() {
          this.showLitebox = true;
      },
      hideLitebox() {
          this.showLitebox = false;
      }
  }
})
````

````html
<div id="app">
    <vue-litebox v-if="showLitebox"
        :items="images"
        @close="hideLitebox">
    </vue-litebox>
    <button type="button" @click="showLitebox">Show Litebox</button>
</div>
````

### Options
* **items** Array of url strings and/or objects with a `src` property
* **startAt** The index at which to start the lightbox
* **closeCaption** The caption to display on the close button. Defaults to 'Close'
* **prevCaption** The caption to display on the prev arrow button. Defaults to 'Previous'
* **nextCaption** The caption to display on the next arrow button. Default to 'Next'
* **loadingCaption** The caption to display whilst loading a media item. Defaults to 'Loading...'
* **videoRegex** The regex to match for video URLs which will displayed in a 16:9 ration iframe. Defailts to `/youtube.com|vimeo.com/`
* **closeOnEsc** Define whether to close the lightbox on `Esc` key press. Defaults to `true`
* **nextOnImageClick** Define whether clicking an image moves you to the next image. Defaults to `true`
