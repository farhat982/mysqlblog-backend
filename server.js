import express from 'express'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, Date.now() + file.originalname)
  },
})

const upload = multer({ storage: storage })

//const upload = multer({ dest: './uploads/' })

app.post('/api/upload', upload.single('file'), function (req, res) {
  const file = req.file
  res.status(200).json(file.filename)
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/posts', postRoutes)

app.listen(8000, () => {
  console.log('Server is running on port 8000')
})
