const express = require('express');
const app = express();
// const accountSid ="ACee982bbebd2af56be6e90c7fd81414fc";
// const authToken = "f67cfe20cd2bcfc58fd8db0b458590ac";
// const serviceId = "VAb63988495919c45b7e60483c6bb7ec24"
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_TOKEN;

const client = require("twilio")(accountSid, authToken);

app.use(express.static("public"));
app.use(express.json());

app.get(`/`, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get(`/home`, (req, res) => {
  res.sendFile(__dirname + "/home");
});


//------Send OTP------------
app.post(`/send-verification-otp`, (req, res) => {
  const { mobileNumber } = req.body;

  client.verify
    .services(serviceId)
    .verifications.create({ to: "+91"+mobileNumber, channel: "sms" })
    .then((verification) => {
      return res.status(200).json({ verification });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
});



//----------Verify OTP----------
app.post(`/verify-otp`, (req, res) => {
  const { mobileNumber, code } = req.body;
  client.verify
    .services(serviceId)
    .verificationChecks.create({ to: "+91" + mobileNumber, code })
    .then((verification_check) => {
      // res.redirect(__dirname+"/home.html")
      return res.status(200).json({ verification_check });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
});


//for sending code in outbound code
app.post('/make-call', (req, res) => {

  const { mobileNumber, code } = req.body;
  client.calls
  .create({
     twiml: '<Response><Say>Your code here</Say></Response>',
     sendDigits:code,
     to: '+91'+mobileNumber,
     from: '+13254238925'
   })
  .then(call => console.log(call.sid));


})


app.listen(3000, () => {
  console.log("Listening ....");
});
