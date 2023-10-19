const MB = 5; // 5 MB
const FILE_SIZE_LIMIT = 1024 * 1024 * MB;

const fileSizeLimiter =  (req,res,next) => {

    const files = req.files;
    const filesOverLimit = [];

    Object.keys(files).forEach((key => {
        if(files[key].size > FILE_SIZE_LIMIT) filesOverLimit.push(files[key].name);
    }));

    if(filesOverLimit.length){
   

        const message = `Upload failed! ${filesOverLimit.toString()} exceeded the file limit size of ${MB} MB. `.replaceAll(',', ' and');

        return res.status(413).json({status:"error", message: message});

    }

    next();
}

module.exports = {
    fileSizeLimiter: fileSizeLimiter
}


