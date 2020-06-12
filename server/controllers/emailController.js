
// const senGrid = require('../helpers/sendgrid')
const { User } = require('../models');

class EmailController {
    static send(req, res, next) {
    const sendgrid = require('@sendgrid/mail');
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const message = {
    to: req.currentUserEmail,
    from: 'no-reply@bap.my.id',
    subject: req.body.subject,
    html: req.body.message,
};
sendgrid.send(message)
  .then(() => {
    console.log('Email sent to ' + message.to);
    res.status(200).json({message:"success"})
  },
  (error) => {
    if (error.response) {
            console.error(error.response.body);
            next({name:''})
                        }
                    }
                );

    }
}

module.exports = EmailController;
