"use strict";

let baseUrl = "http://localhost:3000";
let idTemporary = "";
$(document).ready(function () {
  auth();
  $(".signin-form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      method: "post",
      url: baseUrl + "/users/login",
      data: {
        email: $("#email-signin").val(),
        password: $("#password-signin").val(),
      },
    })
      .done((data) => {
        localStorage.setItem("token", data.token);
        auth();
      })
      .fail((err) => {
        console.log(err.responseJSON.message, "-error");
      })
      .always((_) => {
        $("#email-signin").val("");
        $("#password-signin").val("");
      });
  });
});
function auth() {
  if (localStorage.token) {
    $("#signup-page").hide();
    $("#signup-success").hide();
    $("#signin-page").hide();
    $("#main-page").show();
  } else {
    $("#signup-page").hide();
    $("#signup-success").hide();
    $("#signin-page").show();
    $("#main-page").hide();
  }
}
function showSignUpPage() {
  $("#signup-page").show();
  $("#signup-success").hide();
  $("#signin-page").hide();
}
function showSignInPage() {
  $("#signup-page").hide();
  $("#signup-success").hide();
  $("#signin-page").show();
}
function signup(event) {
  event.preventDefault();
  $.ajax({
    method: "post",
    url: baseUrl + "/users/register",
    data: {
      email: $("#email-signup").val(),
      password: $("#password-signup").val(),
    },
  })
    .done((_) => {
      $("#signup-page").hide();
      $("#signup-success").show();
    })
    .fail((err) => {
      console.log(err.responseJSON.message, "-error");
    })
    .always((_) => {
      $("#email-signup").val("");
      $("#password-signup").val("");
    });
}
function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    url: `${baseUrl}/users/google`,
    method: "POST",
    headers: {
      google_token: id_token,
    },
  })
    .done((data) => {
      localStorage.setItem("token", data.token);
      auth();
    })
    .fail((err) => {
      console.log(err);
    });
}
function signout() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.clear();
    auth();
  });
}
