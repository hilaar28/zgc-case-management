<#
.SYNOPSIS
    Installs ZGC Case Management services as Windows services for auto-start.

.DESCRIPTION
    This script creates Windows services for MongoDB, Apache, and optionally
    the Node.js API server to run automatically on system startup.

.NOTES
    Run this script as Administrator
#>

#requires -RunAsAdministrator

param(
    [string]$MongoDBPath = "C:\Program Files\MongoDB\Server\6.0\bin",
    [string]$MongoDBDataPath = "D:\data\db",
    [string]$XAMPPPath = "C:\xampp",
    [string]$APIProjectPath = "C:\xampp\htdocs\zgc-case-management\api",
    [int]$APIPort = 8082
)

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "ZGC Case Management - Windows Service Install" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a service exists
function ServiceExists {
    param([string]$ServiceName)
    return Get-Service $ServiceName -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq $ServiceName }
}

# Function to create a service
function CreateService {
    param(
        [string]$ServiceName,
        [string]$DisplayName,
        [string]$BinaryPath,
        [string]$Description,
        [string]$StartType = "Automatic"
    )
    
    if (ServiceExists -ServiceName $ServiceName) {
        Write-Host "[SKIP] Service '$ServiceName' already exists" -ForegroundColor Yellow
        return
    }
    
    Write-Host "[CREATE] Creating service '$DisplayName'..." -ForegroundColor Cyan
    
    try {
        $service = New-Service -Name $ServiceName `
            -BinaryPathName $BinaryPath `
            -DisplayName $DisplayName `
            -Description $Description `
            -StartType $StartType `
            -ErrorAction Stop
            
        Write-Host "[OK] Service '$ServiceName' created successfully" -ForegroundColor Green
        
        # Start the service immediately
        Start-Service $ServiceName
        Write-Host "[START] Service '$ServiceName' started" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERROR] Failed to create service '$ServiceName': $_" -ForegroundColor Red
    }
}

# Check if MongoDB bin exists
if (Test-Path "$MongoDBPath\mongod.exe") {
    $mongodPath = "$MongoDBPath\mongod.exe"
    $mongodParams = "--dbpath `"$MongoDBDataPath`" --logpath `"$APIProjectPath\..\logs\mongodb.log`" --bind_ip 127.0.0.1 --service"
    
    CreateService `
        -ServiceName "ZGCMongoDB" `
        -DisplayName "ZGC Case Management - MongoDB" `
        -BinaryPath "$mongodPath $mongodParams" `
        -Description "MongoDB database server for ZGC Case Management System" `
        -StartType "Automatic"
}
else {
    Write-Host "[WARN] MongoDB not found at $MongoDBPath" -ForegroundColor Yellow
    Write-Host "       Please install MongoDB or update the MongoDBPath variable" -ForegroundColor Yellow
}

# Check if Apache httpd exists
if (Test-Path "$XAMPPPath\apache\bin\httpd.exe") {
    $apacheParams = "-k runservice"
    
    CreateService `
        -ServiceName "ZGCApache" `
        -DisplayName "ZGC Case Management - Apache" `
        -BinaryPath "$XAMPPPath\apache\bin\httpd.exe $apacheParams" `
        -Description "Apache web server for ZGC Case Management System" `
        -StartType "Automatic"
}
else {
    Write-Host "[WARN] Apache not found at $XAMPPPath" -ForegroundColor Yellow
    Write-Host "       Please install XAMPP or update the XAMPPPath variable" -ForegroundColor Yellow
}

# Create a service for the Node.js API server using NSSM
$nssmPath = "$XAMPPPath\nssm\win64\nssm.exe"
$nssmInstallPath = "$APIProjectPath\nssm-install.bat"

if (Test-Path $nssmInstallPath) {
    Write-Host ""
    Write-Host "[INFO] Using NSSM to install API service..." -ForegroundColor Cyan
    
    # Check if NSSM exists
    if (Test-Path "$XAMPPPath\nssm\win64\nssm.exe") {
        # Create NSSM service for API
        CreateService `
            -ServiceName "ZGCAPI" `
            -DisplayName "ZGC Case Management - API Server" `
            -BinaryPath "$XAMPPPath\nssm\win64\nssm.exe install ZGCAPI `"$XAMPPPath\nodejs\node.exe`" `"$APIProjectPath\main.js`"" `
            -Description "Node.js API server for ZGC Case Management System" `
            -StartType "Automatic"
    }
    else {
        Write-Host "[INFO] NSSM not found. To create API as a service, install NSSM." -ForegroundColor Yellow
        Write-Host "       Download from: https://nssm.cc/" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Service installation complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services created:" -ForegroundColor White
Write-Host "  - ZGCMongoDB  : MongoDB Database" -ForegroundColor White
Write-Host "  - ZGCApache   : Apache Web Server" -ForegroundColor White
Write-Host ""
Write-Host "To manage services, use:" -ForegroundColor White
Write-Host "  Services manager (services.msc)" -ForegroundColor White
Write-Host "  Or run: Get-Service ZGC*" -ForegroundColor White
Write-Host ""
Write-Host "To uninstall, run: Remove-Service ZGCMongoDB" -ForegroundColor White
Write-Host "                   Remove-Service ZGCApache" -ForegroundColor White
