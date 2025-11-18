import admin from 'firebase-admin';

// Mock data - Firebase yoksa kullanılacak
const mockProviders = [
  {
    _id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+1 (555) 123-4567',
    service: 'Profesyonel Boya Badana Hizmeti',
    category: 'Badana & Boya',
    description: '15 yıllık tecrübemizle ev ve işyerlerinizde profesyonel boya badana hizmeti sunuyoruz. Kaliteli malzeme ve uygun fiyat garantisi.',
    serviceArea: 'New York, Manhattan, Brooklyn',
    country: 'USA',
    image: null,
    approved: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    phone: '+1 (555) 234-5678',
    service: 'Hukuki Danışmanlık',
    category: 'Avukat',
    description: 'Göçmenlik, iş hukuku ve aile hukuku konularında uzman avukatlık hizmeti. 20 yıllık tecrübe.',
    serviceArea: 'Los Angeles, CA',
    country: 'USA',
    image: null,
    approved: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    _id: '3',
    name: 'Ali Demir',
    email: 'ali@example.com',
    phone: '+1 (416) 345-6789',
    service: 'Modern Web Tasarım',
    category: 'Web Tasarımcı',
    description: 'Responsive ve modern web siteleri tasarlıyoruz. E-ticaret, kurumsal ve kişisel web siteleri.',
    serviceArea: 'Toronto, ON',
    country: 'Canada',
    image: null,
    approved: true,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    _id: '4',
    name: 'Fatma Öztürk',
    email: 'fatma@example.com',
    phone: '+1 (555) 456-7890',
    service: 'Elektrik Tesisatı',
    category: 'Elektrikçi',
    description: 'Lisanslı elektrikçi. Ev ve işyeri elektrik arızaları, yeni tesisat, panel montajı.',
    serviceArea: 'Chicago, IL',
    country: 'USA',
    image: null,
    approved: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    _id: '5',
    name: 'Can Arslan',
    email: 'can@example.com',
    phone: '+1 (416) 567-8901',
    service: 'Tesisatçı',
    category: 'Tesisat',
    description: 'Su tesisatı, kalorifer, kombi bakım ve onarım hizmetleri. 7/24 acil servis.',
    serviceArea: 'Vancouver, BC',
    country: 'Canada',
    image: null,
    approved: true,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  }
];

// Initialize Firebase Admin
let db;
const initializeFirebase = () => {
  if (!db) {
    try {
      if (!admin.apps.length) {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
          ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
          : {
              type: "service_account",
              project_id: process.env.FIREBASE_PROJECT_ID,
              private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
              client_email: process.env.FIREBASE_CLIENT_EMAIL,
            };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      }
      db = admin.firestore();
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }
  return db;
};

export const handler = async (event, context) => {
  const db = initializeFirebase();
  
  // Path parsing - Netlify redirects ile gelen path'i temizle
  let path = event.path
    .replace('/.netlify/functions/api/', '')
    .replace('/.netlify/functions/api', '')
    .replace('/api/', '')
    .replace('/api', '');
  
  // Eğer path boşsa, ana endpoint
  if (!path || path === '/') {
    path = '';
  }
  
  console.log('Request path:', event.path);
  console.log('Parsed path:', path);
  console.log('Method:', event.httpMethod);
  console.log('Query params:', event.queryStringParameters);
  
  const method = event.httpMethod;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Debug endpoint
    if (path === '' || path === '/' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'TBC API is working!',
          requestPath: event.path,
          parsedPath: path,
          method: method,
          hasFirebase: !!db,
          mockDataCount: mockProviders.length
        })
      };
    }

    // GET /api/categories
    if (path === 'categories' && method === 'GET') {
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
        'Emlak',
        'Fotoğrafçılık',
        'Danışmanlık',
        'Diğer Hizmetler'
      ];
      
      console.log('Categories endpoint hit');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(categories)
      };
    }

    // GET /api/providers
    if (path === 'providers' && method === 'GET') {
      const params = event.queryStringParameters || {};
      
      // Firebase yoksa mock data kullan
      if (!db) {
        let filtered = [...mockProviders];
        
        if (params.country) {
          filtered = filtered.filter(p => p.country === params.country);
        }
        if (params.category) {
          filtered = filtered.filter(p => p.category === params.category);
        }
        if (params.approved !== undefined) {
          filtered = filtered.filter(p => p.approved === (params.approved === 'true'));
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(filtered)
        };
      }

      // Firebase varsa normal işlem
      let query = db.collection('providers');

      if (params.country) {
        query = query.where('country', '==', params.country);
      }
      if (params.category) {
        query = query.where('category', '==', params.category);
      }
      if (params.approved !== undefined) {
        query = query.where('approved', '==', params.approved === 'true');
      }

      const snapshot = await query.orderBy('createdAt', 'desc').get();
      const providers = [];
      
      snapshot.forEach(doc => {
        providers.push({
          _id: doc.id,
          ...doc.data()
        });
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(providers)
      };
    }

    // GET /api/providers/:id
    if (path.startsWith('providers/') && method === 'GET') {
      const id = path.split('/')[1];
      
      // Firebase yoksa mock data kullan
      if (!db) {
        const provider = mockProviders.find(p => p._id === id);
        if (!provider) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: 'Hizmet sağlayıcı bulunamadı' })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(provider)
        };
      }
      
      const doc = await db.collection('providers').doc(id).get();
      
      if (!doc.exists) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Hizmet sağlayıcı bulunamadı' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          _id: doc.id,
          ...doc.data()
        })
      };
    }

    // POST /api/providers
    if (path === 'providers' && method === 'POST') {
      const body = JSON.parse(event.body);
      
      // Firebase yoksa mock response
      if (!db) {
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            message: 'Başvurunuz alındı! Onay sonrası listelenecektir.',
            provider: {
              _id: Date.now().toString(),
              ...body,
              approved: false,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        };
      }
      
      const providerData = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        service: body.service,
        category: body.category,
        description: body.description,
        serviceArea: body.serviceArea,
        country: body.country,
        image: body.image || null,
        approved: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('providers').add(providerData);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'Başvurunuz alındı! Onay sonrası listelenecektir.',
          provider: {
            _id: docRef.id,
            ...providerData
          }
        })
      };
    }

    // PUT /api/providers/:id
    if (path.startsWith('providers/') && method === 'PUT') {
      const id = path.split('/')[1];
      const body = JSON.parse(event.body);
      
      if (!db) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'Güncelleme başarılı (mock mode)',
            provider: { _id: id, ...body }
          })
        };
      }
      
      const updateData = {
        ...body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('providers').doc(id).update(updateData);
      const updatedDoc = await db.collection('providers').doc(id).get();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Güncelleme başarılı',
          provider: {
            _id: updatedDoc.id,
            ...updatedDoc.data()
          }
        })
      };
    }

    // DELETE /api/providers/:id
    if (path.startsWith('providers/') && method === 'DELETE') {
      const id = path.split('/')[1];
      
      if (!db) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Silme işlemi başarılı (mock mode)' })
        };
      }
      
      await db.collection('providers').doc(id).delete();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Silme işlemi başarılı' })
      };
    }

    // 404 - Endpoint not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Endpoint bulunamadı' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Sunucu hatası',
        error: error.message 
      })
    };
  }
};
