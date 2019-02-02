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
          href: "https://cdn.chae.sh/uikit/css/uikit.min.css"
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
