const router = require('express').Router();
const File = require('../models/file') //Mongoose databse model

router.get('/:uuid', async(req, res) => {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file) {
        return res.render('download', { error: 'Link has been expired.' });
    }
    console.log(req.params.uuid)
    const filePath = `${__dirname}/../${file.path}`;
    console.log(filePath)

    // download the file
    res.download(filePath);
})

module.exports = router;