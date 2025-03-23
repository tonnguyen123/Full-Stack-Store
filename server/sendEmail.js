import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, text, attachment = null) {
    const msg = {
        to,
        from: "tontaro2802@gmail.com",
        subject,
        text,
    };

    if(attachment){
        msg.attachments = [ 
        {
            content: attachment.data,
            filename: attachment.name,
            type: attachment.type,
            disposition: "attachment"
        }
    ];
    }

    try {
        await sgMail.send(msg);
        console.log("Email sent!");
    } catch (error) {
        console.error(error);
    }
}

export default sendEmail;
