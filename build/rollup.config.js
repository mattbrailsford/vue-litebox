import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
import minify from 'rollup-plugin-babel-minify'; // Minify the output js

export default {
    input: 'src/wrapper.js', // Path relative to package.json
    output: {
        name: 'VueLitebox',
        exports: 'named',
    },
    plugins: [
        vue({
            css: 'dist/vue-litebox.css', // Export css to file
            compileTemplate: true, // Explicitly convert template to render function
        }),
        buble(), // Transpile to ES5
        minify({ // Minify
            comments: false,
            banner: '/* VueLitebox */'
        }) 
    ],
};