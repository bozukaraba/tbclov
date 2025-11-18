# TBC Platform - Hizmet Sağlayıcı Marketplace

Amerika ve Kanada'daki hizmet sağlayıcıları bir araya getiren modern, responsive platform.

## Özellikler

- 🌍 USA ve Canada için ayrı hizmet listeleri
- 📝 Hizmet sağlayıcı başvuru formu
- 🛠️ Admin paneli (başvuru onaylama)
- 🔍 Kategori ve arama filtreleri
- 📱 Tam responsive tasarım
- 🎨 Modern ve sade arayüz
- 📷 Resim yükleme desteği
- 🎯 TBC servisleri modal sistemi

## Teknolojiler

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **Styling:** Modern CSS with CSS Variables

## Kurulum

1. Depoyu klonlayın:
```bash
git clone https://github.com/bozukaraba/tbclov.git
cd tbclov
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Firebase Projesi Oluşturun:
   - [Firebase Console](https://console.firebase.google.com/) adresine gidin
   - Yeni proje oluşturun
   - Firestore Database'i aktif edin
   - Project Settings → Service Accounts → Generate New Private Key
   - İndirilen JSON dosyasındaki bilgileri `.env` dosyasına ekleyin

4. `.env` dosyasını düzenleyin:
```env
PORT=3000
NODE_ENV=production

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email@your-project-id.iam.gserviceaccount.com
```

5. Projeyi build edin:
```bash
npm run build
```

6. Sunucuyu başlatın:
```bash
npm start
```

## Geliştirme Modu

Frontend ve backend'i ayrı ayrı çalıştırmak için:

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

## Render ile Deploy

1. [Render.com](https://render.com)'da yeni bir Web Service oluşturun
2. GitHub repository'sini bağlayın (bozukaraba/tbclov)
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variables ekleyin:
   - `FIREBASE_PROJECT_ID`: Firebase proje ID'niz
   - `FIREBASE_PRIVATE_KEY`: Private key (tırnak içinde)
   - `FIREBASE_CLIENT_EMAIL`: Service account email
   - `NODE_ENV`: `production`

**Not:** Firebase Service Account JSON'ını tek environment variable olarak da ekleyebilirsiniz:
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

## Firebase Firestore Yapısı

### Collection: `providers`
```javascript
{
  name: string,
  email: string,
  phone: string,
  service: string,
  category: string,
  description: string,
  serviceArea: string,
  country: 'USA' | 'Canada',
  image: string | null,
  approved: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Firestore İndeksler

Aşağıdaki composite index'leri Firestore Console'dan oluşturun:
- Collection: `providers`
  - Fields: `country` (Ascending), `approved` (Ascending), `createdAt` (Descending)
  - Fields: `category` (Ascending), `approved` (Ascending), `createdAt` (Descending)

## API Endpoints

- `GET /api/providers` - Hizmet sağlayıcıları listele
  - Query params: `country`, `category`, `approved`
- `POST /api/providers` - Yeni başvuru
- `PUT /api/providers/:id` - Başvuru güncelle/onayla
- `DELETE /api/providers/:id` - Başvuru sil
- `GET /api/categories` - Kategorileri listele

## Admin Panel

Admin paneline `/admin` adresinden erişilebilir. Burada bekleyen başvuruları onaylayabilir veya silebilirsiniz.

## Güvenlik Notları

- `.env` dosyası asla Git'e eklenmemelidir
- Firebase service account key'leri güvenli tutulmalıdır
- Production'da environment variables Render dashboard'dan yönetilir

## Lisans

© 2025 TBC Platform. Tüm hakları saklıdır.
