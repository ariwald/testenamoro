const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("req.file is not there");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;
    s3.putObject({
        //bucket name
        Bucket: "ariawsgenaubucket",
        //acces control
        ACL: "public-read",
        //req.file
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    })
        .promise()
        .then(() => {
            console.log("it worked...promise");
            next();
            //to delete the files
            fs.unlink(path, () => {});
        })
        .catch(err => {
            console.log(err, "final phase of upload");
            res.sendStatus(500);
        });
};
