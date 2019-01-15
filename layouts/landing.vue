<template>
  <div>
    <nuxt/>
  </div>
</template>
<script>
export default {
  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.oxro.io/uikit/3.0.25/css/uikit.min.css"
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Inconsolata"
        }
      ]
    };
  }
};
</script>