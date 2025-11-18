import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // For local development
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID || "your-project-id",
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "",
      client_email: process.env.FIREBASE_CLIENT_EMAIL || "",
    };
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase başarıyla başlatıldı');
} catch (error) {
  console.error('Firebase başlatma hatası:', error);
}

const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../dist')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'));
    }
  }
});

// API Routes

// Get all service providers (with optional filters)
app.get('/api/providers', async (req, res) => {
  try {
    const { country, category, approved } = req.query;
    let query = db.collection('providers');
    
    if (country) {
      query = query.where('country', '==', country);
    }
    if (category) {
      query = query.where('category', '==', category);
    }
    if (approved !== undefined) {
      query = query.where('approved', '==', approved === 'true');
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const providers = [];
    
    snapshot.forEach(doc => {
      providers.push({
        _id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(providers);
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ message: 'Hata oluştu', error: error.message });
  }
});

// Get single provider
app.get('/api/providers/:id', async (req, res) => {
  try {
    const doc = await db.collection('providers').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Hizmet sağlayıcı bulunamadı' });
    }
    
    res.json({
      _id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    res.status(500).json({ message: 'Hata oluştu', error: error.message });
  }
});

// Create new provider
app.post('/api/providers', upload.single('image'), async (req, res) => {
  try {
    const providerData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      service: req.body.service,
      category: req.body.category,
      description: req.body.description,
      serviceArea: req.body.serviceArea,
      country: req.body.country,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('providers').add(providerData);
    
    res.status(201).json({ 
      message: 'Başvurunuz alındı! Onay sonrası listelenecektir.', 
      provider: {
        _id: docRef.id,
        ...providerData
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Hata oluştu', error: error.message });
  }
});

// Update provider (approve or update info)
app.put('/api/providers/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    await db.collection('providers').doc(req.params.id).update(updateData);
    
    const updatedDoc = await db.collection('providers').doc(req.params.id).get();
    
    res.json({ 
      message: 'Güncelleme başarılı', 
      provider: {
        _id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Hata oluştu', error: error.message });
  }
});

// Delete provider
app.delete('/api/providers/:id', async (req, res) => {
  try {
    await db.collection('providers').doc(req.params.id).delete();
    res.json({ message: 'Silme işlemi başarılı' });
  } catch (error) {
    res.status(500).json({ message: 'Hata oluştu', error: error.message });
  }
});

// Categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const categories = [
      'Badana & Boya',
      'Avukat',
      'Web Tasarımcı',
      'Tadilat & Tamirat',
      'Elektrikçi',
      'Tesisat',
      'Temizlik',
      'Nakliyat',
      'Bahçe Bakımı',
      'Diğer'
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Hata oluştu', error: error.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
