# Keep-awake loop for the booth (run on a spare device)
$Api = "https://medflow-api-wil26sc.onrender.com"
while ($true) {
  try { $c = (Invoke-WebRequest "$Api/health" -UseBasicParsing -TimeoutSec 60).StatusCode } catch { $c = "ERR" }
  Write-Host "$(Get-Date -Format HH:mm:ss) health: $c"
  Start-Sleep 300
}
