const router = require("express").Router()
const uploader = require("./multer")
const cloudinary = require("./cloudinary")
const InstaPost = require("./models")
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.get("/data", async (req, res) => {
    try {
        const getdata = await InstaPost.find().sort({Date:-1});
        res.json({
            result: getdata
        })
    }
    catch (e) {
        res.send.json({
            status: "failed",
            message: e.message
        })

    }

})
router.post("/form", uploader.single('file'), async (req, res) => {
    console.log(req.body,req.file)
    try {
        const upload = await cloudinary.v2.uploader.upload(req.file.path);
        const data=await InstaPost.insertMany({
            file: upload.secure_url,
            Author:req.body.Author,
            Location:req.body.Location,
            Description:req.body.Description,
            Likes:Math.ceil(Math.random()*1000),
            Date:Date.now()
        });
        return res.json({
            success: true,
            result:data,
        });
    }
    catch (e) {
        return res.json({
            err: e.message
        });
    }
});
module.exports = router