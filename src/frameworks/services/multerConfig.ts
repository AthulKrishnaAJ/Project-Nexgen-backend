import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = path.join(__dirname, '../../../uploads')

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true})
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function(req, file, cb) {
        cb(null, path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

export default upload