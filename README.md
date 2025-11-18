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
- **Backend:** Netlify Serverless Functions
- **Database:** Firebase Firestore
- **Hosting:** Netlify
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
   - İndirilen JSON dosyasını saklayın

4. Yerel geliştirme:
```bash
npm run dev
```

## Netlify ile Deploy

### 1️⃣ Netlify'da Yeni Site Oluşturun:

1. [Netlify](https://app.netlify.com) hesabınıza giriş yapın
2. **Add new site** → **Import an existing project**
3. GitHub'dan repository'yi seçin: `bozukaraba/tbclov`
4. Build ayarları otomatik algılanacak:
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`

### 2️⃣ Environment Variables Ekleyin:

Netlify Dashboard → Site settings → Environment variables:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

**Alternatif:** Tek variable olarak:
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

### 3️⃣ Deploy Edin:

- **Deploy site** butonuna tıklayın
- Netlify otomatik olarak build ve deploy edecek
- Birkaç dakika sonra siteniz yayında!

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
  - Fields: `country` (Ascending), `createdAt` (Descending)
  - Fields: `approved` (Ascending), `createdAt` (Descending)
  - Fields: `category` (Ascending), `createdAt` (Descending)

## API Endpoints (Netlify Functions)

Tüm API istekleri `/.netlify/functions/api/` prefix'i ile çalışır:

- `GET /api/providers` - Hizmet sağlayıcıları listele
  - Query params: `country`, `category`, `approved`
- `GET /api/providers/:id` - Tek sağlayıcı detayı
- `POST /api/providers` - Yeni başvuru
- `PUT /api/providers/:id` - Başvuru güncelle/onayla
- `DELETE /api/providers/:id` - Başvuru sil
- `GET /api/categories` - Kategorileri listele

## Admin Panel

Admin paneline `/admin` adresinden erişilebilir. Burada bekleyen başvuruları onaylayabilir veya silebilirsiniz.

## Proje Yapısı

```
├── client/
│   └── src/
│       ├── components/     # Header, Footer
│       ├── pages/          # Home, ProviderList, ProviderForm, AdminPanel
│       └── styles/         # Global CSS
├── netlify/
│   └── functions/
│       └── api.js          # Serverless API endpoints
├── netlify.toml            # Netlify yapılandırması
└── vite.config.js          # Vite yapılandırması
```

## Güvenlik Notları

- `.env` dosyası asla Git'e eklenmemelidir
- Firebase service account key'leri güvenli tutulmalıdır
- Production'da environment variables Netlify dashboard'dan yönetilir
- API rate limiting Netlify tarafından otomatik yapılır

## Lisans

© 2025 TBC Platform. Tüm hakları saklıdır.
