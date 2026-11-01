param(
  [string]$Api = "https://medflow-api-wil26sc.onrender.com",
  [string]$Web = "https://medflow-web-wil26sc.onrender.com",
  [string]$Pages = "https://tashiel-singh.github.io/WorthITSolutions-WIL-INSY7315-/",
  [string]$Email,
  [string]$Password,
  [string]$Out = "docs\production-verification.md"
)
$ErrorActionPreference = "Stop"
$script:rows = @()
function Add-Row($check, $ok, $detail) {
  $r = if ($ok) { "PASS" } else { "FAIL" }
  $script:rows += "| $check | $r | $detail |"
}
function Test-Http($name, $url) {
  try {
    $sw = [Diagnostics.Stopwatch]::StartNew()
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 90
    $sw.Stop()
    Add-Row $name ($r.StatusCode -eq 200) "HTTP $($r.StatusCode) in $($sw.ElapsedMilliseconds) ms (first request, may include a cold start)"
  } catch { Add-Row $name $false $_.Exception.Message }
}
function Test-Tls($url) {
  $u = [Uri]$url
  try {
    $tcp = New-Object Net.Sockets.TcpClient($u.Host, 443)
    $ssl = New-Object Net.Security.SslStream($tcp.GetStream())
    $ssl.AuthenticateAsClient($u.Host)
    $c = New-Object Security.Cryptography.X509Certificates.X509Certificate2($ssl.RemoteCertificate)
    $days = [int]($c.NotAfter - (Get-Date)).TotalDays
    Add-Row "TLS certificate $($u.Host)" ($days -gt 7) "$($ssl.SslProtocol), trusted chain, expires $($c.NotAfter.ToString('yyyy-MM-dd')) ($days days left)"
    $ssl.Dispose(); $tcp.Close()
  } catch { Add-Row "TLS certificate $($u.Host)" $false $_.Exception.Message }
}

Test-Http "Web app (Render static site)" $Web
Test-Http "GitHub Pages mirror" $Pages
Test-Http "API /health" "$Api/health"
Test-Tls $Web
Test-Tls $Api

try {
  $r = Invoke-WebRequest -Uri ($Web -replace '^https:','http:') -UseBasicParsing -TimeoutSec 60
  $final = $r.BaseResponse.ResponseUri.AbsoluteUri
  Add-Row "HTTP redirects to HTTPS (web)" ($final -like 'https:*') $final
} catch { Add-Row "HTTP redirects to HTTPS (web)" $false $_.Exception.Message }

try {
  $r = Invoke-WebRequest -Uri "$Api/health" -UseBasicParsing -Headers @{ Origin = $Web }
  $acao = $r.Headers['Access-Control-Allow-Origin']
  Add-Row "CORS allows the web origin" ($acao -eq $Web) "Access-Control-Allow-Origin: $acao"
} catch { Add-Row "CORS allows the web origin" $false $_.Exception.Message }

$ms = @()
foreach ($i in 1..5) {
  $sw = [Diagnostics.Stopwatch]::StartNew()
  try { Invoke-WebRequest "$Api/health" -UseBasicParsing -TimeoutSec 60 | Out-Null; $ms += $sw.ElapsedMilliseconds } catch {}
}
if ($ms.Count -gt 0) {
  $avg = [int](($ms | Measure-Object -Average).Average)
  $mn = ($ms | Measure-Object -Minimum).Minimum
  $mx = ($ms | Measure-Object -Maximum).Maximum
  Add-Row "API latency, 5 warm requests" ($avg -lt 500) "min $mn / avg $avg / max $mx ms (design target: reads under 500 ms)"
} else { Add-Row "API latency, 5 warm requests" $false "no successful requests" }

try {
  Invoke-WebRequest "$Api/api/products" -UseBasicParsing | Out-Null
  Add-Row "Protected route rejects anonymous callers" $false "HTTP 200 (expected 401)"
} catch {
  $code = [int]$_.Exception.Response.StatusCode
  Add-Row "Protected route rejects anonymous callers" ($code -eq 401) "HTTP $code"
}

if ($Email -and $Password) {
  try {
    $body = @{ email = $Email; password = $Password } | ConvertTo-Json
    $login = Invoke-RestMethod -Method Post -Uri "$Api/api/auth/login" -ContentType "application/json" -Body $body
    $tok = $login.accessToken
    Add-Row "Login (body parsed, user read from database, JWT issued)" ([bool]$tok) "token issued: $([bool]$tok)"
    $hdr = @{ Authorization = "Bearer $tok" }
    $p = Invoke-WebRequest -Uri "$Api/api/products" -UseBasicParsing -Headers $hdr
    Add-Row "Authenticated database read (/api/products)" ($p.StatusCode -eq 200) "HTTP $($p.StatusCode), $($p.Content.Length) bytes"
    $a = Invoke-WebRequest -Uri "$Api/api/analytics/revenue-breakdown" -UseBasicParsing -Headers $hdr
    Add-Row "Aggregate database query (revenue breakdown)" ($a.StatusCode -eq 200) "HTTP $($a.StatusCode)"
  } catch { Add-Row "Login and authenticated reads" $false $_.Exception.Message }
} else {
  Add-Row "Login and authenticated reads" $false "skipped: pass -Email and -Password"
}

$sha = (git rev-parse --short HEAD)
$md = @("# Production verification", "",
  "Run: $(Get-Date -Format 'yyyy-MM-dd HH:mm') (local time)  ",
  "Commit: $sha  ", "Web: $Web  ", "API: $Api  ", "Pages mirror: $Pages", "",
  "| Check | Result | Detail |", "|---|---|---|") + $script:rows
$md | Out-File $Out -Encoding ascii
$md | ForEach-Object { Write-Host $_ }
