const { User } = require('../models');
const sendgrid = require('@sendgrid/mail');

class EmailController {
    static send(req, res, next) {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
        const message = {
            to: req.currentUserEmail,
            from: 'no-reply@bap.my.id',
            subject: req.body.subject,
            html: req.body.message,
        };
        console.log(message);
        sendgrid.send(message).then(
            () => {
                console.log(`Email sent to ${message.to}`);
                res.status(200).json({ message: 'success' });
            },
            (error) => {
                if (error.response) {
                    next({ name: '' });
                }
            }
        );
    }
}

module.exports = EmailController;
