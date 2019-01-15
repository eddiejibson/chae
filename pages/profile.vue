<template></template>
<script>
export default {
  mounted() {
    let username = localStorage.getItem("username");
    if (condition) {
      this.$router.push(`/${username}`);
    } else {
      this.$router.push("/login");
    }
  }
};
</script>