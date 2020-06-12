let sendGrid = (to ,subject ,html) => {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
    to: to,
  from: 'tes@mail.com',
  subject: subject,
  html:html
};
//ES6
sgMail
.send(msg)
.then(() => {}, error => {
    console.error(error);
    
    if (error.response) {
        console.error(error.response.body)
    }
});

}
  module.exports = sendGrid

