
const loginForm = document.getElementById("login-form");
const callForm = document.getElementById("call-form");
const codeInput = document.getElementById("codeInput");
const baseUrl = `http://localhost:3000/`;
let mobileNumber;
let isOTPDelivered = false;
const responseHTML = document.querySelector(".response");


loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  mobileNumber = parseInt(document.getElementById("phoneInput").value);
  if (isNaN(mobileNumber)) {
    alert("Invalid Phone Number");
  }
  let len = (mobileNumber + "").length;
  if (len !== 10) {
    alert("Please check the length of number")
  } else {
    //process
    if (isOTPDelivered) {
      const code = codeInput.value;
      const response = await verifyOTP(mobileNumber, code);
      alert(response.status);
      codeInput.parentElement.classList.add("hidden"); 
      return;
    }

    const response = await sendVerificationCode(mobileNumber);
    if (response.status === "pending") {
      codeInput.parentElement.classList.remove("hidden");
      isOTPDelivered = true;
    }
  }
})

async function sendVerificationCode(mobileNumber) {
  const res = await axios.post(baseUrl + `send-verification-otp`, {
      mobileNumber,
  });

  if (res.status === 200) {
      return res.data.verification;
  } else {
      return res.data;
  }
}


callForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  mobileNumber = parseInt(document.getElementById("phoneInput").value);
  let len = (mobileNumber + "").length;
  if (len !== 10) {
    alert("Please check the length of number")
  }else{
    alert("Call made")

  }

  if (isNaN(mobileNumber)) {
    alert("Invalid Phone Number");
  }
  else {
    //work
    const response = await makeCall(mobileNumber);
  }

});


async function verifyOTP(mobileNumber, code) {
  const res = await axios.post(baseUrl + `verify-otp`, {
    mobileNumber,
    code,
  });

  if (res.status === 200) {
    return res.data.verification_check;
  } else {
    return res.data;
  }
}





async function makeCall(mobileNumber) {
  const res = await axios.post(baseUrl + `make-call`, {
    mobileNumber,
  });

  if (res.status === 200) {
    return res.data.verification;
  } else {
    return res.data;
  }
}
