import admin from 'firebase-admin';

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
  const path = event.path.replace('/.netlify/functions/api/', '');
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
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(categories)
      };
    }

    // GET /api/providers
    if (path === 'providers' && method === 'GET') {
      const params = event.queryStringParameters || {};
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
