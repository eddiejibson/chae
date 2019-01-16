<style scoped>
a {
  color: #fff;
}
.code-area {
  font-family: "Courier new";
  font-size: 18px;
  line-height: 1.5em;
  cursor: default;
  position: absolute;
  width: 500px;
  min-width: 500px;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.code-area > span {
  display: block;
}
@media screen and (max-width: 320px) {
  .code-area {
    font-size: 5vw;
    min-width: auto;
    width: 95%;
    margin: auto;
    padding: 5px;
    padding-left: 10px;
    line-height: 6.5vw;
  }
}
.container {
  color: #d3d7de;
  width: 100%;
  height: 80%;
  position: absolute;
}
</style>
<style>
body {
  margin: 0;
}
</style>
<template>
  <div class="container">
    <div class="code-area">
      <span style="color: #777;font-style:italic;">// {{ error.statusCode }} {{ error.message }}.</span>
      <span>
        <span style="color:#d65562;">if</span>
        (
        <span style="color:#4ca8ef;">!</span>
        <span style="font-style: italic;color:#bdbdbd;">found</span>)
        <span style="color:#2796ec">
          <i style="width: 10px;display:inline-block"></i>throw
        </span>
        <span>
          (
          <span style="color: #a6a61f">"(╯°□°)╯︵ ┻━┻"</span>);
        </span>
      </span>
      <span>
        <span style="color: #777;font-style:italic;">//
          <nuxt-link to="/">Go home!</nuxt-link>
        </span>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["error"],
  layout: "none",
  head() {
    return {
      title: `Error ${this.error.statusCode}`
    };
  },
  mounted() {
  }
};
</script>

