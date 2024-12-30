document.getElementById("loginButton").addEventListener("click", function() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
});

document.getElementById("registerButton").addEventListener("click", function() {
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("loginForm").style.display = "none";
});

document.getElementById("goToRegister").addEventListener("click", function() {
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("loginForm").style.display = "none";
});

document.getElementById("goToLogin").addEventListener("click", function() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
});
