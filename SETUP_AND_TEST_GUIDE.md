# 🏠 Real Estate Spatial Explorer - Setup & Test Guide

## 📋 Prerequisites

Đảm bảo mày đã cài đặt:
- ✅ Java 17+
- ✅ Maven 3.8+
- ✅ Node.js 18+
- ✅ PostgreSQL 14+ with PostGIS extension
- ✅ (Optional) GeoServer 2.21+ nếu muốn test WMS layer

---

## 🚀 SETUP STEP-BY-STEP

### Step 1: Setup Database

#### 1.1. Start PostgreSQL
```bash
# Windows (nếu dùng service)
# Mở Services → Start PostgreSQL

# Hoặc dùng command line
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start
```

#### 1.2. Drop database cũ (nếu có)
```bash
# Mở psql hoặc pgAdmin
psql -U postgres

# Trong psql:
DROP DATABASE IF EXISTS realestate;
DROP USER IF EXISTS realestate;
\q
```

#### 1.3. Chạy init script
```bash
# Từ thư mục root của project
psql -U postgres -f db/init_postgis.sql
```

**Hoặc dùng pgAdmin:**
1. Mở pgAdmin
2. Connect vào PostgreSQL server
3. Tools → Query Tool
4. Mở file `db/init_postgis.sql`
5. Click Execute (F5)

#### 1.4. Verify database
```bash
psql -U realestate -d realestate

# Trong psql, check tables:
\dt

# Should see:
# - users
# - properties
# - property_types
# - property_images
# - user_favorites
# - search_history

# Check data:
SELECT COUNT(*) FROM properties;
# Should return: 15

SELECT COUNT(*) FROM users;
# Should return: 3

\q
```

---

### Step 2: Start Backend

```bash
cd backend

# Clean và compile
mvn clean install

# Start backend
mvn spring-boot:run
```

**Backend sẽ chạy trên:** `http://localhost:8080`

**Verify backend:**
- Mở browser: `http://localhost:8080/api/properties`
- Should see GeoJSON với 15 properties

---

### Step 3: Start Frontend

```bash
cd frontend

# Install dependencies (lần đầu)
npm install

# Start dev server
npm run dev
```

**Frontend sẽ chạy trên:** `http://localhost:5173`

---

## 🧪 TESTING GUIDE

### Test 1: Xem Bản Đồ & Properties

1. Mở browser: `http://localhost:5173`
2. ✅ Bản đồ OpenStreetMap hiện ra (khu vực New York)
3. ✅ Thấy các polygon màu xanh (15 properties)
4. ✅ Sidebar bên trái hiện danh sách properties

**Expected:**
- Map centered ở New York (40.7128, -74.006)
- 15 property polygons màu xanh nhạt
- Property list bên trái với thumbnail images

---

### Test 2: Click Property để xem Details

1. Click vào bất kỳ polygon xanh nào trên map
2. ✅ Popup hiện bên phải với:
   - Gallery ảnh (có nút prev/next nếu nhiều ảnh)
   - Tên property
   - Giá (formatted USD)
   - Địa chỉ
   - Bedrooms, bathrooms, area
   - Year built, floors, direction
   - Property type badge
   - Status badge (AVAILABLE/SOLD)
   - Description
   - Views count

**Try clicking:**
- "Luxury Manhattan Penthouse" - $2,500,000
- "Brooklyn Brownstone" - $1,850,000
- "Tribeca Loft" - $3,200,000

---

### Test 3: Login & Authentication

1. Click nút **"Login"** ở góc phải trên
2. Modal login hiện ra
3. Dùng demo account:
   - Username: `john_doe`
   - Password: `password123`
4. Click **"Login"**
5. ✅ Modal đóng
6. ✅ Header hiện "👤 john_doe" và nút "Logout"

**Other demo accounts:**
- `admin` / `password123` (role: ADMIN)
- `jane_smith` / `password123` (role: USER)

---

### Test 4: Favorites (Yêu Thích)

**Phải login trước!**

1. Login với `john_doe`
2. Click vào property bất kỳ để mở popup
3. Click icon ❤️ ở góc phải trên popup
4. ✅ Icon đổi từ 🤍 → ❤️
5. Click tab **"❤️ Saved"** ở sidebar
6. ✅ Chỉ hiện properties đã save

**Test remove favorite:**
1. Click lại icon ❤️
2. ✅ Icon đổi từ ❤️ → 🤍
3. Property biến mất khỏi "Saved" tab

---

### Test 5: Featured Properties

1. Click tab **"⭐ Featured"** ở sidebar
2. ✅ Chỉ hiện 10 featured properties
3. ✅ Properties có badge "⭐ FEATURED" màu vàng

**Featured properties:**
- Luxury Manhattan Penthouse
- Brooklyn Brownstone
- Tribeca Loft
- Upper East Side Condo
- Williamsburg Waterfront
- Chelsea Townhouse
- SoHo Commercial Loft
- Long Island City New Development
- West Village Charmer

---

### Test 6: Advanced Filters

1. Click nút **"🔍 Filters"** ở sidebar
2. Filter panel hiện ra
3. **Test filter by price:**
   - Min Price: `1000000`
   - Max Price: `2000000`
   - ✅ Chỉ hiện properties trong khoảng $1M-$2M

4. **Test filter by bedrooms:**
   - Min Bedrooms: `3`
   - ✅ Chỉ hiện properties có ≥3 bedrooms

5. **Test filter by property type:**
   - Select: `APARTMENT`
   - ✅ Chỉ hiện apartments

6. **Test filter by status:**
   - Select: `AVAILABLE`
   - ✅ Không hiện "Battery Park City Family Home" (SOLD)

7. **Test sort:**
   - Sort By: `Price`
   - Direction: `Ascending`
   - ✅ Properties sắp xếp từ rẻ → đắt

8. Click **"Reset"** để clear filters

---

### Test 7: Draw Polygon Search

1. Click tab **"All"** để xem tất cả properties
2. Trên map, click vào icon **polygon** (hình vuông) bên trái
3. Click nhiều điểm trên map để vẽ polygon
4. Double-click để hoàn thành polygon
5. ✅ Backend query properties trong polygon
6. ✅ Map chỉ hiện properties nằm trong vùng đã vẽ

**Try drawing around:**
- Manhattan area (nhiều properties)
- Brooklyn area (vài properties)

---

### Test 8: Draw Circle Search

1. Click icon **circle** trên map
2. Click và drag để vẽ circle
3. ✅ Properties trong circle được filter

---

### Test 9: Search Address (Nominatim)

1. Ở search bar góc phải trên, gõ: `Central Park`
2. ✅ Dropdown hiện suggestions
3. Click vào suggestion
4. ✅ Map fly to location (console log)

**Try searching:**
- "Times Square"
- "Brooklyn Bridge"
- "Empire State Building"

---

### Test 10: Property List View

1. Click nút **"📋 List"** ở sidebar
2. ✅ Danh sách properties với:
   - Thumbnail image
   - Name
   - Price (formatted)
   - Address
   - Bedrooms/bathrooms/area icons
   - Featured badge (nếu có)
   - Favorite heart icon

3. Click vào property trong list
4. ✅ Popup detail hiện ra

---

### Test 11: Layer Toggle

1. Uncheck nút **"📋 List"** và **"🔍 Filters"**
2. ✅ Layer toggle panel hiện ra
3. Uncheck **"Parcels"**
4. ✅ Property polygons biến mất
5. Check lại **"Parcels"**
6. ✅ Property polygons hiện lại

---

### Test 12: Responsive UI

1. Resize browser window
2. ✅ Sidebar vẫn hiện đầy đủ
3. ✅ Map tự động adjust
4. ✅ Popup không bị overflow

---

### Test 13: Multiple Users & Favorites

**Test isolation của favorites:**

1. Login với `john_doe`
2. Save 3 properties
3. Logout
4. Login với `jane_smith`
5. ✅ Favorites khác nhau (jane_smith có 3 favorites khác)
6. ✅ Mỗi user có favorites riêng

---

### Test 14: View Counter

1. Click vào property "Luxury Manhattan Penthouse"
2. Note views count (e.g., 245 views)
3. Close popup
4. Click lại property đó
5. ✅ Views tăng lên 1 (246 views)

---

### Test 15: Image Gallery

1. Click property có nhiều ảnh (e.g., "Luxury Manhattan Penthouse")
2. ✅ Gallery hiện ảnh đầu tiên
3. Click nút **›** (next)
4. ✅ Ảnh tiếp theo hiện ra
5. Click nút **‹** (prev)
6. ✅ Quay lại ảnh trước
7. ✅ Counter hiện "2 / 3" (current / total)

---

## 🐛 TROUBLESHOOTING

### Backend không start

**Error: "Could not connect to database"**
```bash
# Check PostgreSQL đang chạy
psql -U postgres -c "SELECT version();"

# Check database exists
psql -U postgres -c "\l" | grep realestate
```

**Error: "Port 8080 already in use"**
```bash
# Kill process trên port 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Hoặc đổi port trong application.yml
```

---

### Frontend không start

**Error: "EADDRINUSE: Port 5173 already in use"**
```bash
# Kill process
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Error: "Cannot find module"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

### Map không hiện

**Check console errors:**
1. F12 → Console tab
2. Nếu thấy "Leaflet icon error":
   - Đã fix trong `main.tsx`
   - Restart frontend

**Check network:**
1. F12 → Network tab
2. Check `/api/properties` request
3. Should return 200 with GeoJSON

---

### Properties không hiện trên map

**Check data:**
```bash
psql -U realestate -d realestate
SELECT id, name, ST_AsText(geom) FROM properties LIMIT 3;
```

**Check backend logs:**
- Xem terminal chạy backend
- Tìm errors hoặc exceptions

---

### Login không work

**Check backend logs:**
- Should see POST `/api/auth/login`
- Check response status

**Check browser console:**
- F12 → Console
- Xem error messages

**Verify user exists:**
```bash
psql -U realestate -d realestate
SELECT username, email, role FROM users;
```

---

## 📊 DEMO DATA SUMMARY

### Users (3)
- `admin` / password123 (ADMIN)
- `john_doe` / password123 (USER) - has 3 favorites
- `jane_smith` / password123 (USER) - has 3 favorites

### Properties (15)
- 10 AVAILABLE
- 1 SOLD
- Price range: $425K - $4.5M
- Types: Apartments, Houses, Villas, Offices
- All in New York area
- All have images from Unsplash

### Property Types (6)
- APARTMENT (Căn hộ chung cư)
- HOUSE (Nhà riêng)
- VILLA (Biệt thự)
- LAND (Đất nền)
- OFFICE (Văn phòng)
- COMMERCIAL (Thương mại)

---

## 🎯 DEMO SCENARIOS

### Scenario 1: Tìm Apartment giá dưới $1M
1. Click "🔍 Filters"
2. Property Type: `APARTMENT`
3. Max Price: `1000000`
4. ✅ Result: 6 apartments

### Scenario 2: Tìm nhà có ≥3 phòng ngủ
1. Filters → Min Bedrooms: `3`
2. ✅ Result: 8 properties

### Scenario 3: Xem Featured properties và save yêu thích
1. Login
2. Click "⭐ Featured"
3. Click vào property
4. Click ❤️ để save
5. Click "❤️ Saved" để xem

### Scenario 4: Tìm properties trong khu vực Manhattan
1. Draw polygon around Manhattan
2. ✅ Properties trong vùng được filter

---

## 🎨 UI FEATURES CHECKLIST

✅ Responsive sidebar (280px)
✅ Tabbed navigation (All / Featured / Saved)
✅ Toggle buttons (Filters / List)
✅ Property cards với thumbnails
✅ Favorite heart icons
✅ Featured badges
✅ Status badges (AVAILABLE/SOLD)
✅ Image gallery với prev/next
✅ Formatted prices (USD)
✅ Icons cho bedrooms/bathrooms/area
✅ Login modal
✅ User dropdown
✅ Search bar với autocomplete
✅ Filter panel với reset
✅ Property popup với full details
✅ Map với drawing tools
✅ Layer toggle

---

## 📝 NOTES

- **Password**: Tất cả demo accounts dùng password `password123`
- **Token**: Simple demo token (không dùng JWT thật)
- **Images**: Từ Unsplash, có thể load chậm
- **GeoServer**: Optional, không bắt buộc
- **Database**: Có thể reset bằng cách chạy lại `init_postgis.sql`

---

## 🚀 READY TO DEMO!

Giờ mày có thể demo app với đầy đủ tính năng:
- ✅ Authentication
- ✅ Favorites
- ✅ Advanced filters
- ✅ Property details với gallery
- ✅ Spatial search (polygon/circle)
- ✅ Featured properties
- ✅ Multiple view modes
- ✅ Rich property data

**Chúc mày demo thành công! 🎉**
