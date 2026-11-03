# MedFlow Zero-Dependency Local Static HTTP Server
# Native PowerShell System.Net.HttpListener - Zero external dependencies required.

param (
    [int]$Port = 4173,
    [string]$DistPath = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($DistPath)) {
    $DistPath = Join-Path $PSScriptRoot "dist"
    if (-not (Test-Path $DistPath)) {
        $DistPath = $PSScriptRoot
    }
}

if (-not (Test-Path $DistPath)) {
    Write-Error "Static files directory not found: $DistPath"
    exit 1
}

$MimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".mjs"   = "application/javascript; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".gif"   = "image/gif"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
    ".txt"   = "text/plain; charset=utf-8"
}

$Listener = New-Object System.Net.HttpListener
$Prefix = "http://127.0.0.1:$Port/"
$Listener.Prefixes.Add($Prefix)

try {
    $Listener.Start()
} catch {
    # If 4173 is in use, attempt port 4174
    $Port = $Port + 1
    $Prefix = "http://127.0.0.1:$Port/"
    $Listener = New-Object System.Net.HttpListener
    $Listener.Prefixes.Add($Prefix)
    $Listener.Start()
}

Write-Host "MedFlow Standalone Demo Server listening on $Prefix" -ForegroundColor Green
Write-Host "Serving files from: $DistPath" -ForegroundColor Cyan

$IndexFile = Join-Path $DistPath "index.html"
$AssetsDir = Join-Path $DistPath "assets"

while ($Listener.IsListening) {
    try {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $RawUrl = $Request.RawUrl.Split('?')[0]

        # Handle asset routing
        $FilePath = $null
        if ($RawUrl.Contains("/assets/")) {
            $AssetName = $RawUrl.Substring($RawUrl.IndexOf("/assets/") + 8)
            $Candidate = Join-Path $AssetsDir $AssetName
            if (Test-Path $Candidate -PathType Leaf) {
                $FilePath = $Candidate
            }
        }

        if (-not $FilePath) {
            $Candidate = Join-Path $DistPath ($RawUrl.TrimStart('/'))
            if ((Test-Path $Candidate -PathType Leaf) -and ($RawUrl -ne "/")) {
                $FilePath = $Candidate
            } else {
                # SPA Route Fallback
                $FilePath = $IndexFile
            }
        }

        if (Test-Path $FilePath -PathType Leaf) {
            $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $ContentType = $MimeTypes[$Ext]
            if (-not $ContentType) { $ContentType = "application/octet-stream" }

            $FileBytes = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentType = $ContentType
            $Response.ContentLength64 = $FileBytes.Length
            $Response.Headers.Add("Access-Control-Allow-Origin", "*")
            $Response.Headers.Add("Cache-Control", "no-cache")
            $Response.StatusCode = 200
            $Response.OutputStream.Write($FileBytes, 0, $FileBytes.Length)
        } else {
            $Response.StatusCode = 404
            $NotFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $Response.OutputStream.Write($NotFoundBytes, 0, $NotFoundBytes.Length)
        }

        $Response.OutputStream.Close()
    } catch {
        # Continue listening on socket errors
    }
}
