const User = require('../models/user.js');
const express = require('express');
const co = require('co');
// const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/', (req, res) => {
  co(function* () {
    const { body } = req;
    const user = yield User.findOne({ _id: body.userId });
    user.userName = body.newUserName;
    user.bio = body.newBio;
    user.birthDate = body.newBirthDate;
    yield user.save();
    res.json(user);
  });
});

// router.post('/forgotten', (req, res) => {
//   const transporter = nodemailer.createTransport({
//         // host: 'smtp.example.com',
//     port: 465,
//     secure: true, // secure:true for port 465, secure:false for port 587
//         // auth: {
//         //     user: 'username@example.com',
//         //     pass: 'userpass'
//         // }
//   });
//
// // setup email data with unicode symbols
//   const mailOptions = {
//     from: '"Qwirk" <hello@qwirk.com>', // sender address
//     to: 'alexandre-surin@live.fr', // list of receivers
//     subject: 'Password reset', // Subject line
//     text: 'Hello world ?', // plain text body
//         // html: '<b>Hello world ?</b>' // html body
//   };
//
// // send mail with defined transport object
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log('Message %s sent: %s', info.messageId, info.response);
//   });
//     // co(function* () {
//     //     const { body } = req;
//     //     const user = yield User.findOne({ _id: body.userId });
//     //     user.userName = body.newUserName;
//     //     user.bio = body.newBio;
//     //     yield user.save();
//     //     res.json(user);
//     // });
//   res.json('succes');
// });

module.exports = router;
