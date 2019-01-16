<template>
  <div class="uk-flex uk-flex-center uk-flex-column uk-flex-middle">
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m">
      <p
        style="margin-bottom: 4px;"
      >Maintaining an open source project like this can be tough without an income especially with things like server costs. If you'd like to see this application improve and have your name and relevant link(s) on this page, see the information below. Thank you 🙏</p>
      <ul style="margin-top: 0;">
        <li>
          <a href="https://paypal.me/eddiejibson/5/">PayPal</a>
        </li>
        <li>BTC: 1Favqzb5Bdc7WBBtDQHzYk5ZLgc48dNMku</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #fff !important;
  text-decoration: none !important;
  box-shadow: inset 0 -1px 0 hsla(0, 0%, 100%, 0.4);
}

a:hover {
  box-shadow: inset 0 -1.2em 0 hsla(0, 0%, 100%, 0.4);
}
</style>
<script>
export default {
  mounted() {
    UIkit.offcanvas("#offcanvas-nav").hide();
  }
};
</script>