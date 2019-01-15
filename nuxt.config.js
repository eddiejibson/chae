const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
   ** Headers of the page
   */
  head: {
    title: "chae.",
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    script: [{
        src: "https://cdn.oxro.io/uikit/3.0.25/js/uikit.min.js"
      },
      {
        src: "https://cdn.oxro.io/uikit/3.0.25/js/uikit-icons.min.js"
      },
      {
        src: "https://cdn.jsdelivr.net/npm/sweetalert2@7.33.1/dist/sweetalert2.all.min.js"
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: 'https://chae.sh/favicon.ico'
    }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    "@/assets/css/app.css"
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/blockstack.js"
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}
