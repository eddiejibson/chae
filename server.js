const {
  Nuxt,
  Builder
} = require('nuxt');
const app = require('express')();

const isProd = true;
const config = require('./nuxt.config.js');

config.dev = !(isProd);
const nuxt = new Nuxt(config);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, CF-Connecting-IP");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// No build in production
if (!isProd) {
  const builder = new Builder(nuxt);
  builder.build();
  console.log("Building chae...")
} else {
  console.log("Skipping build, chae is in production...")
}
app.use(nuxt.render);
app.listen(3000);
console.log("Chae is listening on http://localhost:3000");
