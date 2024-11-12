const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");

exports.sendmail = (req, res, next, url) => {
    console.log('sendmail');
    const transport = nodemailer.createTransport({
        service: "gmail",
        host:"smtp.gmail.com",
        port:465,
        auth:{
            user:process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })


    const mailOptions = {
        from: "This email from eventlee",
        to: req.body.email,
        subject: "password reset link",
        html:  `<h1> click the link below to reset the password. </h1>
        <a href="${url}">password reset link</a>`
    }

    transport.sendMail(mailOptions,(err,info)=>{
        console.log('this is sendmail clg');
        if(err) return next(new ErrorHandler(err, 500))
            console.log(info);
        return res.status(200).json({message: "male send successfully", url})
    })

}