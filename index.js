const schedule = require('node-schedule');
const transporter = require("./config/Transporter");
const EmailRecord = require("./Model/HR1847REC");
const {connectDB, closeDB} = require("./config/DB_CONFIG");

async function sendEmails() {
    try {
        await connectDB();
        console.log('Starting email sending process...');

        const batchSize = 500;
        const sentEmailsCount = await EmailRecord.countDocuments({ sent: true });
        console.log(`Sent emails count: ${sentEmailsCount}`);

        const records = await EmailRecord.find()
            .skip(sentEmailsCount)
            .limit(batchSize)
            .exec();

        console.log(`Records fetched: ${records.length}`);

        if (records.length === 0) {
            console.log("All emails have been sent!");
            return;
        }

       
        for (const record of records) {
            console.log("Email Id:", record.Email);
            const mailOptions = {
                from: 'khushdesai1030@gmail.com',
                to: record.Email, // You may want to change this to record.Email
                subject: 'Inquiry for Full Stack Developer Opportunities',
                text: `
Dear ${record.Name},\n
I hope this message finds you well. My name is Khush Desai, and I am writing to inquire about full stack developer opportunities at ${record.Company}. I have developed skills in both front-end and back-end technologies, and I am eager to contribute to your team.\n
Please find my CV attached for your reference. I would appreciate the chance to discuss how I can add value to your projects and organization.\n
Thank you for your time and consideration. I look forward to hearing from you.\n
Best regards,\n
Khush Desai\n
+91 9909048412
`,
                attachments: [
                    {
                        filename: 'KHUSH_CV.pdf', 
                        path: './KHUSH_CV.pdf'  
                    }
                ],
                replyTo: 'khushdesai1010@gmail.com'
            };
        
            // Send email
            try {
                let info = await transporter.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);
            } catch (error) {
                console.error('Error sending email to:', record.Email, error);
            }
        }
        


        // // Update the records as sent
        const ids = records.map(record => record._id);
        await EmailRecord.updateMany(
            { _id: { $in: ids } },
            { $set: { sent: true } }
        );

        console.log('Records updated as sent.');

    } catch (error) {
        console.error('Error sending emails:', error);
    }
    finally{
        closeDB()
    }
}


schedule.scheduleJob('0 8 * * *', () => {
    
    console.log('Starting email batch at 8 AM...');
    sendEmails();
});
sendEmails();
