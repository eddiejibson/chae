<template>
  <div class="user">
    <h3>{{ name }}</h3>
    <h4>@{{ username }}</h4>
    <p>Email : {{ email }}</p>
    <p>
      <NuxtLink to="/">List of users</NuxtLink>
    </p>
  </div>
</template>

<script>
// import axios from "axios";
import * as blockstack from "blockstack";
export default {
  validate({ params }) {
    return true;
  },
  async asyncData({ params, error }) {
    return blockstack.lookupProfile(String(params.id)).then(res => {
      return {
        blockstack: res
      };
    }).catch(err => {
      error({message: "user not found", statusCode: 404})
    });
  },
  mounted() {
    console.log(this);
  }
};
</script>

<style scoped>
.user {
  text-align: center;
  margin-top: 100px;
  font-family: sans-serif;
}
</style>
