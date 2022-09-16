const File = require('./models/file');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();

// Get and delete all records older than 24 hours 
async function deleteData() {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const expiredFiles = await File.find({ createdAt: { $lt: pastDate } });

    if (expiredFiles.length) {
        for (const file of expiredFiles) {
            try {
                fs.unlinkSync(file.path); //unlinked the file from uploads folder
                await file.remove(); //removed the file from database
                console.log(`Successfully deleted file: ${file.filename}`);
            } catch (err) {
                console.log(`Error occured while deleting the file: ${err}`);
            }
        }

        console.log('Deletion Job Done');
    }
}

// deleteData().then(() => {
//     process.exit(); // to stop the script
// })
deleteData().then(process.exit);