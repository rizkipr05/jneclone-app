# JNE Clone App

Aplikasi pengelolaan pengiriman (React Native Expo) dengan backend API Node.js + MySQL.

## Tech Stack
- Frontend: React Native (Expo), React Navigation
- Backend: Node.js, Express
- Database: MySQL
- Auth: JWT

## Fitur Utama
- Login admin
- Input data pengiriman + validasi
- Generate nomor resi otomatis
- Cetak / unduh resi (Expo Print & Sharing)
- Update status pengiriman
- Riwayat pengiriman + pencarian

## Struktur Folder
- `src/` → frontend (Expo)
- `server/` → backend API (Express)

## Demo Account
- Username: `admin`
- Password: `admin123`

## Setup Database (MySQL)
1. Pastikan MySQL berjalan.
2. Import schema:
```sql
SOURCE /opt/lampp/htdocs/jneclone-app/server/schema.sql;
```

## Setup di Windows
### 1) Jalankan MySQL
Jika pakai XAMPP, nyalakan **MySQL** dari XAMPP Control Panel.

### 2) Import Schema
Buka **Command Prompt** atau **PowerShell**:
```bash
mysql -u root -p
```

Di dalam MySQL:
```sql
SOURCE C:/path/ke/jneclone-app/server/schema.sql;
```

Ganti path sesuai lokasi project di Windows.

### 3) Jalankan Backend
```bash
cd C:/path/ke/jneclone-app/server
npm install
copy .env.example .env
```

Edit `.env` (Notepad/VS Code) dan isi password MySQL:
```
PORT=4001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=jneclone
JWT_SECRET=supersecret
```

Lalu:
```bash
npm run dev
```

### 4) Jalankan Frontend (Expo)
```bash
cd C:/path/ke/jneclone-app
npm install
npm start
```

### 5) Konfigurasi API URL di Windows
Edit `src/config/env.js`:
```js
import { Platform } from "react-native";

export const ENV = {
  API_BASE_URL:
    Platform.OS === "web"
      ? "http://localhost:4001/api"
      : "http://10.0.2.2:4001/api"
};
```

Catatan:
- Android emulator memakai `10.0.2.2`
- Web/iOS simulator memakai `localhost`

## Menjalankan Backend
```bash
cd /opt/lampp/htdocs/jneclone-app/server
npm install
cp .env.example .env
```

Edit `.env` dan isi password MySQL:
```
PORT=4001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=jneclone
JWT_SECRET=supersecret
```

Jalankan server:
```bash
npm run dev
```

Test API:
```bash
curl -i -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Menjalankan Frontend (Expo)
```bash
cd /opt/lampp/htdocs/jneclone-app
npm install
npm start
```

### Konfigurasi API URL
Edit `src/config/env.js`:
```js
import { Platform } from "react-native";

export const ENV = {
  API_BASE_URL:
    Platform.OS === "web"
      ? "http://localhost:4001/api"
      : "http://10.0.2.2:4001/api"
};
```

Catatan:
- Android emulator memakai `10.0.2.2`
- Web/iOS simulator memakai `localhost`

## Troubleshooting
- **Port 4001 sudah dipakai**  
  Matikan proses: `lsof -i :4001` lalu `kill -9 <PID>`
- **Login 401 (password salah)**  
  Reset password admin:
```bash
mysql -u root -p -e "USE jneclone; UPDATE users SET password_hash='\$2a\$10\$GugFcy5cLyd9f8xFE3uc1.wl1nn35OBXJWvPB4QpyqT2RfLy1.QT.' WHERE username='admin';"
```
