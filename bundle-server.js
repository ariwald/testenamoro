const express = require("express");
const app = express();

app.use(require("./build.js"));

app.listen(8081, () =>
  console.log(`8081 listens Ready to compile and serve bundle.js`)
);
