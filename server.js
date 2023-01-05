import express, { urlencoded } from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import bodyParser from 'body-parser';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());


app.use(cookieParser());
app.use(
	cors({
		origin: '*',
	})
);

cloudinary.config({
	cloud_name: 'deg348784',
	api_key: '726844471184658',
	api_secret: 'jH4-oJBaTuf1BYDdXnm5PCYpewk',
});
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'DEV1',
	},
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
	return res.json(req.file.path);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(8000, () => {
	console.log('Server is running on port 8000');
});
