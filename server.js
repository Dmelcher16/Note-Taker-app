const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.get("*", function(req, res){
  res.send("Welcome to heroku");
});

app.listen(PORT, () => console.log(`Application running at http://localhost:${PORT}`));
