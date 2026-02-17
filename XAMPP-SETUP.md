# Running ZGC Case Management on XAMPP

This guide explains how to run the ZGC Case Management application using XAMPP.

## Prerequisites

1. **XAMPP installed** - Download from https://www.apachefriends.org/
2. **MongoDB installed** - XAMPP doesn't include MongoDB
   - Download from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud)
3. **Node.js installed** - Required for building and running the app

## Quick Setup (Automated)

Run the setup script:
```bash
setup-xampp.bat
```

This will:
- Install API dependencies
- Install UI dependencies  
- Build the React application
- Create Apache configuration

## Manual Setup

### Step 1: Install Dependencies

```bash
# Install API dependencies
cd api
npm install

# Install UI dependencies
cd ../ui
npm install
```

### Step 2: Build the React UI

```bash
cd ui
npm run build
```

### Step 3: Configure Apache

1. Copy `xampp-config/httpd-xampp.conf` to:
   ```
   C:/xampp/apache/conf/extra/httpd-xampp.conf
   ```

2. Edit `C:/xampp/apache/conf/httpd.conf` and add:
   ```
   Include "conf/extra/httpd-xampp.conf"
   ```

3. Make sure Apache module is enabled. In `httpd.conf`, ensure:
   ```
   LoadModule proxy_module modules/mod_proxy.so
   LoadModule proxy_http_module modules/mod_proxy_http.so
   LoadModule rewrite_module modules/mod_rewrite.so
   ```

### Step 4: Start MongoDB

```bash
mongod
```

### Step 5: Start the API Server

```bash
cd api
npm start
```

The API will run on http://localhost:8082

### Step 6: Start Apache

Start Apache from XAMPP Control Panel or run:
```bash
C:\xampp\apache\bin\httpd.exe
```

### Step 7: Access the Application

Open browser and go to: http://localhost:8080

## Default Login

- **Email:** admin@zgc.co.zw
- **Password:** 1234

## Troubleshooting

### Apache won't start
1. Check if port 8080 is already in use
2. Edit `httpd-xampp.conf` and change the Listen port

### API not accessible
1. Make sure the API is running on port 8082
2. Check Apache error logs: `C:/xampp/apache/logs/zgc-error.log`

### MongoDB connection failed
1. Make sure MongoDB is running
2. Check MongoDB connection string in `api/.env`

### React app shows blank page
1. Check browser console for errors
2. Make sure the build folder exists at `ui/build`
