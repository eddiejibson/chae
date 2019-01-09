<template></template>
<script>
export default {
  mounted() {
    let username = sessionStorage.getItem("username");
    this.$router.push(`/${username}`);
  }
};
</script>