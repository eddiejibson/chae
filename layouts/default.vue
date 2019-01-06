<template>
  <div>
    <Nav/>
    <Navoptions/>
    <nuxt/>
  </div>
</template>


<script>
import Nav from "./partials/nav";
import Navoptions from "./partials/navOptions";
export default {
  components: {
    Nav,
    Navoptions
  },
  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.oxro.io/uikit/3.0.25/css/uikit.min.css"
        },
        {
          rel: "stylesheet",
          href: "https://cdn.chae.sh/css/app.css"
        }
      ]
    };
  }
};
</script>