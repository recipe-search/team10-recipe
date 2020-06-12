'use strict';
const baseUrl = 'http://localhost:3000';

$(document).ready(() => {
    auth();
    // $('TombolSend').submit
});

let sendGrid = (event) =>{
    event.preventDefault()
    let email=$('#email').val()
    let message=$('#message').val()
    $.ajax({
        type: "POST",
        url: baseUrl,
        data: {email,message}
      })
      .done(data =>{
          console.log(data);
          
      })
      .fail(err =>{
          console.log(err);
          
      })
}

