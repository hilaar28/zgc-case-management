# ZGC Case Management - Auto Start Configuration

This guide explains how to configure the ZGC Case Management system to automatically start when Windows boots.

## Quick Setup

### Option 1: Simple Auto-Start (Recommended for most users)

1. **Run the setup script:**
   ```cmd
   add-startup-registry.bat
   ```

   This adds the system to Windows startup via:
   - Current user's startup folder
   - Windows registry (requires admin rights)

### Option 2: Windows Services (Recommended for production)

1. **Run PowerShell as Administrator:**
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\install-windows-services.ps1
   ```

   This creates Windows services that start automatically on boot:
   - `ZGCMongoDB` - MongoDB database
   - `ZGCApache` - Apache web server

## Manual Setup

### Manual: Add to Startup Folder

1. Press `Win + R`
2. Type: `shell:startup`
3. Press Enter
4. Copy `start-silent.vbs` to this folder

### Manual: Add to Registry

1. Press `Win + R`
2. Type: `regedit`
3. Navigate to:
   ```
   HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
   ```
4. Right-click → New → String Value
5. Name: `ZGCCaseManagement`
6. Data: `"C:\path\to\zgc-case-management\start-services.bat"`

## Files Created

| File | Purpose |
|------|---------|
| `start-services.bat` | Main script that starts MongoDB, API, and Apache |
| `start-silent.vbs` | Silent startup wrapper (no console window) |
| `add-startup-registry.bat` | Adds the system to Windows startup |
| `install-windows-services.ps1` | Creates Windows services (requires admin) |

## Configuration

### Edit Paths in `start-services.bat`

If your installation paths differ, edit these variables in `start-services.bat`:

```batch
set MONGODB_PATH=C:\Program Files\MongoDB\Server\6.0\bin
set MONGODB_DATA_PATH=D:\data\db
set API_PATH=C:\xampp\htdocs\zgc-case-management\api
set XAMPP_PATH=C:\xampp
```

### Edit Paths in `install-windows-services.ps1`

Update these parameters when running the PowerShell script:

```powershell
.\install-windows-services.ps1 `
    -MongoDBPath "C:\Program Files\MongoDB\Server\6.0\bin" `
    -MongoDBDataPath "D:\data\db" `
    -XAMPPPath "C:\xampp" `
    -APIProjectPath "C:\xampp\htdocs\zgc-case-management\api"
```

## Testing

1. **Reboot your computer** - The system should start automatically
2. **Access the application:** http://localhost:8080
3. **Check if services are running:**
   ```cmd
   tasklist /FI "IMAGENAME mongod.exe"
   tasklist /FI "IMAGENAME node.exe"
   tasklist /FI "IMAGENAME httpd.exe"
   ```

## Troubleshooting

### Services not starting

1. Check if paths in scripts are correct
2. Ensure MongoDB, Node.js, and XAMPP are installed
3. Check logs in `api\logs\` directory

### Port conflicts

If ports 8080 or 8082 are in use:
1. Edit `xampp-config/httpd-xampp.conf` to change Apache port
2. Edit `api/.env` to change API port

### Removing Auto-Start

**Option 1 (Registry):**
```cmd
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /v ZGCCaseManagement /f
```

**Option 2 (Startup folder):**
Delete `start-silent.vbs` from `shell:startup`

**Option 3 (Windows Services):**
```powershell
Remove-Service ZGCMongoDB
Remove-Service ZGCApache
Remove-Service ZGCAPI
```

## Security Notes

- The auto-start scripts run with the current user's privileges
- For production deployments, consider using Windows Services with dedicated service accounts
- Ensure proper firewall settings to allow HTTP (8080) and API (8082) traffic
