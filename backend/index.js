const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const fs = require('fs');
const app = express();

const uploadedDir = path.join(__dirname, "uploaded/");

app.use(cors());
app.use("/files", express.static('uploaded'));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploaded')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage }).array('file');
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).send(req.files)
    })
});
app.get('/', (req, res) => {
    let list = [];
    fs.readdir(uploadedDir, function(err, filenames) {
        console.log(filenames);
        if (err) {
            // onError(err);
            res.status(500).json(err);
            console.log(err);
            return;
        } else {

            // list = filesnames;
            res.json({ names: filenames });
            console.log("filenames");
        }
        // filenames.forEach(function(filename) {
        //     //    uploadedDir +
        //     fs.readFile(filename, 'utf-8', function(err, content) {
        //         if (err) {
        //             // onError(err);
        //             console.log(err);
        //             return;
        //         }
        //         onFileContent(filename, content);
        //     });
        // });
    });

    // res.sendFile(__dirname + '/uploaded');
    // return express.static('uploaded');
});
app.get('/download', (req, res) => {
    console.log("req");

    console.log(uploadedDir + req.query.filename);
    res.download(uploadedDir + req.query.filename, function(err) {
        if (err) {
            console.log(err);
        }
    });
});
app.listen(8000, () => {
    console.log('App is running on port 8000')
});