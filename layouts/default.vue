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
  }
};
</script>