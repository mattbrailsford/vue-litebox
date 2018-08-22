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
