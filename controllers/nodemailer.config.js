const nodemailer = require("nodemailer");
require("dotenv").config();
const ejs = require("ejs");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  ejs.renderFile(
    __dirname + "/emailTemplate.ejs",
    { name: name, confirmationCode: confirmationCode },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        var mainOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Please confirm your account",
          html: data,
        };
        transport.sendMail(mainOptions).catch((err) => {
          console.log(err.message);
        });
      }
    }
  );
};

//   transport
//     .sendMail({
//       from: process.env.EMAIL,
//       to: email,
//       subject: "Please confirm your account",
//       html: `<h1>Email Confirmation</h1>
//             <h2>Hello ${name}</h2>
//             <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
//             <a href=http://localhost:8000/confirmuser/${confirmationCode}> Click here</a>
//             </div>`,
//     })
//     .catch((err) => {
//       console.log(err.message);
//       throw `err.message`;
//     });
// };/home/arindam/Desktop/freecourseyardbackend/emailTemplate.ejs
