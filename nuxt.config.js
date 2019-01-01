const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
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
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }, {
      rel: "stylesheet",
      href: "https://cdn.oxro.io/uikit/3.0.25/css/uikit.min.css"
    }, {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/inscrybmde@1.11.6/dist/inscrybmde.min.css"
    }, {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/highlight.js/latest/styles/github.min.css"
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
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
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
