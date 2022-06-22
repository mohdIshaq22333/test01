const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();
const uploadedDir = path.join(__dirname, "uploaded/");
app.use(cors());
app.use("/files", express.static("uploaded"));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploaded");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage }).array("file");
app.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).send(req.files);
    });
});
app.get("/", (req, res) => {
    fs.readdir(uploadedDir, function(err, filenames) {
        if (err) {
            res.status(500).json(err);
            return;
        } else {
            res.json({ names: filenames });
        }
    });
});
app.get("/download", (req, res) => {
    res.download(uploadedDir + req.query.filename, function(err) {
        if (err) {
            console.log(err);
        }
    });
});
app.listen(8000, () => {
    console.log("App is running on port 8000");
});