const router = require('express').Router();
const multer = require('multer'); //For managing all functions of file
const path = require('path') //to get the path of the file
const { v4: uuid4 } = require('uuid'); //To store unique ID for each file uploaded
const File = require('../models/file') //Mongoose databse model


let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage,
    // in bytes of 100Mb
    limit: { fileSize: 1000000 * 100 }
}).single('myfile');


// POST Route to get the uploaded file
router.post('/', (req, res) => {

    // Store file in upload folder
    upload(req, res, async(err) => {
        // validate the Request
        if (!req.file) {
            return res.json({ error: "All fields are required." })
        }

        if (err) {
            return res.status(500).send({ error: err.message })
        }
        // Store into database
        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            uuid: uuid4()
        });

        const response = await file.save();
        console.log('uploaded')
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })

    });
});


// Send Email POST route with the file download link 
router.post('/send', async(req, res) => {
    // console.log(req.body);
    // return res.send({});
    const { uuid, emailTo, emailFrom } = req.body;
    //Validate request
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: "All fields are required" });
    }

    const file = await File.findOne({ uuid: uuid });

    if (file.sender) {
        return res.status(422).send({ error: "Email has been already sent!" });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    //Send Email

    const sendMail = require('../services/emailService');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'ShareAny File Sharing',
        text: `${emailFrom} Shared a file with you`,
        html: require('../services/emailTemplate')({
            emailTo: emailTo,
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size / 1000) + 'KB',
            expires: '24 hours'
        })

    });

    return res.send({ success: true })

});

module.exports = router;