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
          href: "https://fonts.googleapis.com/css?family=Inconsolata"
        },
        {
          rel: "stylesheet",
          href: "https://cdn.chae.sh/uikit/css/uikit.min.css"
        },
        {
          rel: "stylesheet",
          href: "https://cdn.chae.sh/css/app.css"
        },
        {
          rel: "stylesheet",
          href: "https://cdn.chae.sh/css/editor.css"
        }
      ]
    };
  },
  mounted() {
    console.log(
      "%cHOLD ON! 😨",
      "color:#d63031;font-size:80px;font-family:Roboto,sans-serif"
    );
    console.log(
      "%cIf someone (or thing) has asked you to input something in here and you don't know what it does, there's a very high chance they're trying to gain control over your account. If this is the case, close the console immediately.",
      "color:#6c5ce7;font-size:20px;font-family:Roboto,sans-serif"
    );
    console.log(
      "%cRemember if you're unaware of what something does, you shouldn't execute it...",
      "color:#6c5ce7;font-size:20px;font-family:Roboto,sans-serif"
    );
  }
};
</script>
