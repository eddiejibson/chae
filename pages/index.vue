<template>
  <div class="landing-container">
    <div class="uk-position-relative">
      <div class="header">
        <h1 style="color: #fff !important;">chae.</h1>
        <p id="sub" class="sub"></p>
      </div>
      <div class="uk-position-top">
        <nav class="uk-navbar-container uk-navbar-transparent" uk-navbar>
          <div class="uk-navbar-right">
            <ul class="uk-navbar-nav">
              <li class="uk-active">
                <a href="#">Landing</a>
              </li>
              <li>
                <a href="https://github.com/eddiejibson/chae">GitHub</a>
              </li>
              <li v-if="!username">
                <a href="/m1screant.id.blockstack">Look Around</a>
              </li>
              <li @click.prevent="signIn" v-if="!username">
                <a href="#">Sign In</a>
              </li>
              <li v-if="username">
                <a :href="'/'+username">Open App</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <div class="part-1">
      <div class="uk-width-1-2@m">
        <h1>
          Why
          <b>chae</b>?
        </h1>
        <p>
          We work hard to provide a powerful yet simple platform for individuals to write articles, posts, tutorials and documentation in a decentralized environment. We believe that this is the best and only way to move forward - where the user's data can be held in their own hands and not in some large corporations. We've utilized
          <a
            href="https://blockstack.org/"
          >Blockstack</a> to make this possible. With chae, new features are being implemented often and not only by the original creator - anyone may contribute via the
          <a
            href="https://github.com/eddiejibson/chae/"
          >GitHub</a> repository which is publicly available.
        </p>
        <div class="features">
          <div class="feature">
            <img
              src="https://cdn.chae.sh/img/icons/ext/decent.svg"
              draggable="false"
              style="-moz-user-select: none;"
            >
            <h1>Decentralized</h1>
          </div>
          <div class="feature">
            <img
              src="https://cdn.chae.sh/img/icons/ext/community.svg"
              draggable="false"
              style="-moz-user-select: none;"
            >
            <h1>Community Orientated</h1>
          </div>
          <div class="feature">
            <img
              src="https://cdn.chae.sh/img/icons/ext/github.svg"
              draggable="false"
              style="-moz-user-select: none;"
            >
            <h1>Open Source</h1>
          </div>
        </div>
        <button class="white-btn" v-if="!username" @click.prevent="signIn">
          <b>Login with Blockstack</b>
        </button>
        <p v-if="username">
          Want to improve this page?
          <a
            href="https://github.com/eddiejibson/chae/blob/master/pages/index.vue"
          >Contribute on GitHub</a>
        </p>
        <div style="padding-bottom: 20px;"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-container h1,
h2,
h3,
h4,
h5,
p {
  color: #bdc3c7;
}
</style>
<style>
.sub {
  padding-left: 10px;
  padding-right: 10px;
}
.feature img {
  width: 100px;
  height: 100px;
}
.feature {
  padding-right: 25px;
  padding-left: 25px;
}
.features {
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

@media only screen and (max-width: 600px) {
  .features {
    flex-direction: column;
  }
  .part-1 {
    margin-top: 20px;
  }
}
.feature h1 {
  margin-top: 5px;
  font-size: 1.5rem;
}
.white-btn {
  padding: 10px 22px;
  font-size: 14px;
  background-color: #fff;
  border: 0;
  border-radius: 5px;
  font-family: "Inconsolata", monospace !important;
  text-transform: uppercase;
}

.white-btn:hover {
  cursor: pointer;
}

.white-btn:focus {
  outline: 0;
}

.footer a,
.part-1 a {
  color: #fff !important;
  text-decoration: none !important;
  box-shadow: inset 0 -1px 0 hsla(0, 0%, 100%, 0.4);
}

.part-1 a:hover {
  box-shadow: inset 0 -1.2em 0 hsla(0, 0%, 100%, 0.4);
}

.part-1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.header h1 {
  font-size: 4rem;
}

.header p {
  font-size: 1.25rem;
}

.header {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5vw));
  height: 70vh;
  background: #6c5ce7;
  animation: color 30s linear infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.header h1 {
  margin: 0;
}

.header p {
  margin-top: 10px;
}

.feature svg {
  position: absolute;
  top: auto;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  color: inherit;
  -webkit-fill: #313339;
  fill: #313339;
  pointer-events: none;
}

.uk-h1,
.uk-h2,
.uk-h3,
.uk-h4,
.uk-h5,
.uk-h6,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Inconsolata", monospace !important;
}

html {
  background-color: #313339 !important;
  font-family: "Inconsolata", monospace !important;
}

@-moz-keyframes color {
  0% {
    background: #6c5ce7;
  }
  25% {
    background: #0984e3;
  }
  50% {
    background: #00b894;
  }
  75% {
    background: #d63031;
  }
  100% {
    background: #6c5ce7;
  }
}
@-webkit-keyframes color {
  0% {
    background: #6c5ce7;
  }
  25% {
    background: #0984e3;
  }
  50% {
    background: #00b894;
  }
  75% {
    background: #d63031;
  }
  100% {
    background: #6c5ce7;
  }
}
@-o-keyframes color {
  0% {
    background: #6c5ce7;
  }
  25% {
    background: #0984e3;
  }
  50% {
    background: #00b894;
  }
  75% {
    background: #d63031;
  }
  100% {
    background: #6c5ce7;
  }
}
@keyframes color {
  0% {
    background: #6c5ce7;
  }
  25% {
    background: #0984e3;
  }
  50% {
    background: #00b894;
  }
  75% {
    background: #d63031;
  }
  100% {
    background: #6c5ce7;
  }
}

em {
  color: #fff !important;
}

.uk-navbar-nav > li.uk-active > a {
  color: #fff !important;
}

.uk-navbar-nav > li > a {
  font-family: "Inconsolata", monospace !important;
  text-transform: none !important;
  color: #d0d5d8 !important;
}

.uk-navbar-nav > li > a:hover {
  color: #fff !important;
}
</style>

<script>
import TypeIt from "typeit";
export default {
  layout: "landing",
  mounted() {
    this.$requireSignIn(this.$router, false)
      .then(res => {
        if (res) {
          let origin = window.location.origin;
          window.location.replace(`${origin}/${res}`);
          console.log(`${origin}/${res}`);
        } else {
        }
      })
      .catch(err => {
        console.error("Oh no", err);
      });
    let username = localStorage.getItem("username");
    if (username) {
      this.username = username;
    }
    new TypeIt("#sub", {
      speed: 50,
      startDelay: 900
    })
      .type("Write your posts in piece")
      .pause(300)
      .delete(4)
      .pause(250)
      .type("eace.")
      .pause(750)
      .delete(15)
      .pause(750)
      .type("<em>decentralized</em> posts in peace.")
      .pause(800)
      .delete(50)
      .type(
        "Finally write <em>powerful</em> documentation where you're in control of your data."
      )
      .pause(800)
      .type(" 🕴️")
      .go();
  },
  methods: {
    signIn() {
      this.$signIn();
    }
  },
  data() {
    return {
      username: null
    };
  }
};
</script>
