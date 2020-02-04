const express = require("express");
const bodyPaser = require("body-parser");
const request = require("request");
require("dotenv").config();

const app = express();

app.use(express.static("Public"));

app.use(bodyPaser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  var api = process.env.API_KEY;

  var options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/510a6ac6bf",
    method: "POST",
    headers: {
      "Authorization": api
    },
    body: jsonData
  }

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server started running");
});


//2055b4bc13fb9cb7417875cc01250a7e-us4
//510a6ac6bf
