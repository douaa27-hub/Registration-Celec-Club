
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}


function isChecked(id) {
  const el = document.getElementById(id);
  return el ? el.checked : false;
}


function toggleStudentId() {
  const group = document.getElementById("studentIdGroup");
  if (group) {
    group.style.display = isChecked("isUsthbStudent") ? "block" : "none";
  }
}


function showFileName(input, spanId) {
  const el = document.getElementById(spanId);
  if (el && input.files.length > 0) {
    el.textContent = "✓ " + input.files[0].name;
    el.style.display = "block";
  }
}


function updateCount() {
  const len = val("motivation").length;
  const counter = document.getElementById("charCount");
  if (counter) counter.textContent = len + " / 1000";
}


function showError(id, show) {
  const el = document.getElementById("err-" + id);
  if (el) el.style.display = show ? "block" : "none";
  const input = document.getElementById(id);
  if (input) input.style.borderColor = show ? "#ff4d6d" : "#1e3055";
}


function showFormError(message) {
  let banner = document.getElementById("formErrorBanner");

  if (!banner) {
    banner = document.createElement("div");
    banner.id = "formErrorBanner";
    banner.style.cssText = `
      background-color: rgba(255, 77, 109, 0.15);
      border: 1px solid #ff4d6d;
      color: #ff4d6d;
      border-radius: 7px;
      padding: 14px 16px;
      margin-top: 16px;
      font-size: 0.88rem;
      text-align: center;
    `;
    const btn = document.getElementById("submitBtn");
    if (btn) btn.insertAdjacentElement("afterend", banner);
    else document.body.appendChild(banner);
  }

  banner.textContent = "⚠ " + message;
  banner.style.display = "block";
  banner.scrollIntoView({ behavior: "smooth" });
}


function validate() {
  let valid = true;

 
  if (val("fullName").length < 3) {
    showError("fullName", true);
    valid = false;
  } else {
    showError("fullName", false);
  }

  
  const dob = val("dateOfBirth");
  if (!dob) {
    showError("dateOfBirth", true);
    valid = false;
  } else {
    const age = (Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 16 || age > 35) {
      showError("dateOfBirth", true);
      valid = false;
    } else {
      showError("dateOfBirth", false);
    }
  }

  
  if (!/^(\+213|0)(5|6|7)\d{8}$/.test(val("phoneNumber"))) {
    showError("phoneNumber", true);
    valid = false;
  } else {
    showError("phoneNumber", false);
  }

  
  const email = val("email");
  if (!email.includes("@") || !email.includes(".")) {
    showError("email", true);
    valid = false;
  } else {
    showError("email", false);
  }

 
  if (isChecked("isUsthbStudent") && !val("studentId")) {
    showError("studentId", true);
    valid = false;
  } else {
    showError("studentId", false);
  }

  
  if (val("motivation").length < 50) {
    showError("motivation", true);
    valid = false;
  } else {
    showError("motivation", false);
  }

  return valid;
}

async function submitForm() {
  if (!validate()) return;

  const btn = document.getElementById("submitBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Submitting...";
  }

  
  const oldBanner = document.getElementById("formErrorBanner");
  if (oldBanner) oldBanner.style.display = "none";

  
  const formData = new FormData();
  formData.append("fullName",       val("fullName"));
  formData.append("dateOfBirth",    val("dateOfBirth"));
  formData.append("email",          val("email"));
  formData.append("phoneNumber",    val("phoneNumber"));
  formData.append("isMember",       isChecked("isMember"));
  formData.append("isUsthbStudent", isChecked("isUsthbStudent"));
  formData.append("studentId",      val("studentId"));
  formData.append("studyLevel",     val("studyLevel"));
  formData.append("department",     val("department"));
  formData.append("fieldOfStudy",   val("fieldOfStudy"));
  formData.append("linkedin",       val("linkedin"));
  formData.append("github",         val("github"));
  formData.append("motivation",     val("motivation"));

  
  const skills    = val("skills").split(",").map(s => s.trim()).filter(Boolean);
  const interests = val("areasOfInterest").split(",").map(s => s.trim()).filter(Boolean);
  formData.append("skills",          JSON.stringify(skills));
  formData.append("areasOfInterest", JSON.stringify(interests));

  
  const schoolCertEl = document.getElementById("schoolCert");
  const cvEl         = document.getElementById("cv");
  if (schoolCertEl && schoolCertEl.files[0]) formData.append("schoolCert", schoolCertEl.files[0]);
  if (cvEl         && cvEl.files[0])         formData.append("cv",         cvEl.files[0]);

  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      const form = document.getElementById("registrationForm");
      const box  = document.getElementById("successBox");
      if (form) form.style.display = "none";
      if (box)  box.style.display  = "block";
    } else {
      showFormError(result.message || "Something went wrong. Please try again.");
      if (btn) { btn.disabled = false; btn.textContent = "Submit Application"; }
    }

  } catch (error) {
    showFormError("Could not connect to the server. Make sure the backend is running on port 3000.");
    if (btn) { btn.disabled = false; btn.textContent = "Submit Application"; }
  }
}
