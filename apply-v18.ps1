$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root = $PSScriptRoot
$patchRoot = Join-Path $root "patch"
$officialDir = Join-Path $root "public\rental\official"
$platformPath = Join-Path $root "components\rental\RentalPlatform.tsx"

if (-not (Test-Path $patchRoot)) {
  throw "The patch folder was not found."
}

if (-not (Test-Path $platformPath)) {
  throw "RentalPlatform.tsx was not found."
}

New-Item -ItemType Directory -Force -Path $officialDir | Out-Null

$downloads = @(
  [pscustomobject]@{ File = "lg-oled55c6kna.jpg"; Url = "https://www.lge.co.kr/kr/images/tvs/md10770847/gallery/large-interior01.jpg"; Referer = "https://www.lge.co.kr/" },
  [pscustomobject]@{ File = "lg-oled83c5kna.jpg"; Url = "https://www.lge.co.kr/kr/images/tvs/md10543846/gallery/large-interior01.jpg"; Referer = "https://www.lge.co.kr/" },
  [pscustomobject]@{ File = "lg-fq18gv6ek2.jpg"; Url = "https://www.lge.co.kr/kr/images/air-conditioners/md10825826/gallery/large-interior01.jpg"; Referer = "https://www.lge.co.kr/" },
  [pscustomobject]@{ File = "lg-sq07gs9ees.jpg"; Url = "https://www.lge.co.kr/kr/images/air-conditioners/md10731828/gallery/large-interior01.jpg"; Referer = "https://www.lge.co.kr/" },
  [pscustomobject]@{ File = "lg-y324gq7s.jpg"; Url = "https://www.lge.co.kr/kr/images/convertible-refrigerators/md10583876/gallery/large-interior01.jpg"; Referer = "https://www.lge.co.kr/" },
  [pscustomobject]@{ File = "lg-g646gbb091.jpg"; Url = "https://www.lge.co.kr/kr/images/refrigerators/md10780840/gallery/large-interior01.jpg"; Referer = "https://www.lge.co.kr/" },
  [pscustomobject]@{ File = "lg-y324gb7.jpg"; Url = "https://www.lge.co.kr/kr/images/convertible-refrigerators/md10574833/gallery/large-interior01.jpg"; Referer = "https://www.lge.co.kr/" },
  [pscustomobject]@{ File = "lg-g646svv091.jpg"; Url = "https://www.lge.co.kr/kr/images/refrigerators/md10780842/gallery/large-interior01.jpg"; Referer = "https://www.lge.co.kr/" },
  [pscustomobject]@{ File = "lg-dishwasher-due6bgl2e.jpg"; Url = "https://www.lge.co.kr/kr/images/dishwashers/md10492836/gallery/DUE6BGL2E.jpg"; Referer = "https://www.lge.co.kr/" },
  [pscustomobject]@{ File = "coway-chp-5730l.jpg"; Url = "https://storage.bilrigo.com/data/thumbnails/251126/Tud5sJZLF8CgJedwXdgTAXYamZyWhx.jpg"; Referer = "https://m.clvrental777.com/" },
  [pscustomobject]@{ File = "coway-chpi-5810l.jpg"; Url = "https://storage.bilrigo.com/data/thumbnails/251126/LYWbBmeRF7MpNamUCm2n3fG8QcZGLr.jpg"; Referer = "https://m.clvrental777.com/" },
  [pscustomobject]@{ File = "sk-wpupbc204s.jpg"; Url = "https://storage.bilrigo.com/data/thumbnails/251124/b7lecJEZLX8Q5MpTfwsAZzHU8A15vy.jpg"; Referer = "https://m.clvrental777.com/" },
  [pscustomobject]@{ File = "cuckoo-cp-aas100ulw.jpg"; Url = "https://storage.bilrigo.com/data/thumbnails/251125/xDWe8c4zZDZntwgkb9AxDRpLDcswXg.jpg"; Referer = "https://m.clvrental777.com/" },
  [pscustomobject]@{ File = "cesco-ewbd151.jpg"; Url = "https://storage.bilrigo.com/data/thumbnails/240621/4bgB8M5P4qrVaHEZHQLapMuaJzUz5A.jpg"; Referer = "https://m.clvrental777.com/" },
  [pscustomobject]@{ File = "cesco-ewbd351.jpg"; Url = "https://storage.bilrigo.com/data/thumbnails/251125/JpcdT3UwzJmPPkes6zSg7bExHLV36C.jpg"; Referer = "https://m.clvrental777.com/" },
  [pscustomobject]@{ File = "ruhens-whp-2000.jpg"; Url = "https://storage.bilrigo.com/data/thumbnails/251127/3aNPVrccFjJtU9nyHsLKQ2dWGMhET5.jpg"; Referer = "https://m.clvrental777.com/" },
  [pscustomobject]@{ File = "hyundai-p-a52s.jpg"; Url = "https://storage.bilrigo.com/data/thumbnails/251126/ebQNz9aVSwqsUMfKZ6TsZe31yHkHsM.jpg"; Referer = "https://m.clvrental777.com/" }
)

function Test-Jpeg([string]$Path) {
  if (-not (Test-Path $Path)) { return $false }
  $bytes = [System.IO.File]::ReadAllBytes($Path)
  return $bytes.Length -gt 2000 -and $bytes[0] -eq 255 -and $bytes[1] -eq 216
}

function Download-Jpeg($Item) {
  $target = Join-Path $officialDir $Item.File

  if (Test-Jpeg $target) {
    Write-Host ("Ready: " + $Item.File)
    return
  }

  if (Test-Path $target) {
    Remove-Item -Force $target
  }

  $attemptError = $null

  try {
    $client = New-Object System.Net.WebClient
    $client.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142 Safari/537.36")
    $client.Headers.Add("Accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8")
    $client.Headers.Add("Referer", $Item.Referer)
    $client.DownloadFile($Item.Url, $target)
  }
  catch {
    $attemptError = $_.Exception.Message
  }

  if (-not (Test-Jpeg $target)) {
    if (Test-Path $target) {
      Remove-Item -Force $target
    }

    try {
      Invoke-WebRequest `
        -Uri $Item.Url `
        -OutFile $target `
        -UseBasicParsing `
        -Headers @{
          "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142 Safari/537.36"
          "Accept" = "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
          "Referer" = $Item.Referer
        }
    }
    catch {
      $attemptError = $_.Exception.Message
    }
  }

  if (-not (Test-Jpeg $target)) {
    if (Test-Path $target) {
      Remove-Item -Force $target
    }
    throw ("Image download failed: " + $Item.File + " / " + $attemptError)
  }

  Write-Host ("Downloaded: " + $Item.File)
}

foreach ($item in $downloads) {
  Download-Jpeg $item
}

$copyItems = @(
  @{ Source = "data\rental\products.ts"; Destination = "data\rental\products.ts" },
  @{ Source = "services\rental-products.service.ts"; Destination = "services\rental-products.service.ts" },
  @{ Source = "components\rental\RentalQuickCategories.tsx"; Destination = "components\rental\RentalQuickCategories.tsx" }
)

foreach ($item in $copyItems) {
  $source = Join-Path $patchRoot $item.Source
  $destination = Join-Path $root $item.Destination
  $destinationDir = Split-Path -Parent $destination
  New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
  Copy-Item -Force $source $destination
}

$productImageSource = Join-Path $patchRoot "public\rental\products"
$productImageDestination = Join-Path $root "public\rental\products"
New-Item -ItemType Directory -Force -Path $productImageDestination | Out-Null
Copy-Item -Force (Join-Path $productImageSource "*") $productImageDestination

$content = [System.IO.File]::ReadAllText(
  $platformPath,
  [System.Text.Encoding]::UTF8
)

$logic = [System.Text.Encoding]::UTF8.GetString(
  [System.Convert]::FromBase64String("ZnVuY3Rpb24gZWZmZWN0aXZlQ2FyZERpc2NvdW50KHByb2R1Y3Q6IFJlbnRhbFByb2R1Y3QpIHsKICBjb25zdCBwcmljZSA9IHByb2R1Y3QubW9udGhseVByaWNlOwogIGNvbnN0IGRpc2NvdW50ID0gcHJvZHVjdC5tYXhDYXJkRGlzY291bnQ7CgogIGlmICgKICAgIHByaWNlID09PSBudWxsIHx8CiAgICBwcmljZSA8PSAwIHx8CiAgICBkaXNjb3VudCA9PT0gbnVsbCB8fAogICAgZGlzY291bnQgPD0gMCB8fAogICAgZGlzY291bnQgPj0gcHJpY2UKICApIHsKICAgIHJldHVybiBudWxsOwogIH0KCiAgcmV0dXJuIGRpc2NvdW50Owp9CgpmdW5jdGlvbiBjYWxjdWxhdGVkRmluYWxQcmljZShwcm9kdWN0OiBSZW50YWxQcm9kdWN0KSB7CiAgY29uc3QgcHJpY2UgPSBwcm9kdWN0Lm1vbnRobHlQcmljZTsKICBpZiAocHJpY2UgPT09IG51bGwgfHwgcHJpY2UgPD0gMCkgcmV0dXJuIG51bGw7CgogIGlmICgKICAgIHByb2R1Y3QuZmluYWxQcmljZSAhPT0gbnVsbCAmJgogICAgcHJvZHVjdC5maW5hbFByaWNlID4gMCAmJgogICAgcHJvZHVjdC5maW5hbFByaWNlIDw9IHByaWNlCiAgKSB7CiAgICByZXR1cm4gcHJvZHVjdC5maW5hbFByaWNlOwogIH0KCiAgY29uc3QgZGlzY291bnQgPSBlZmZlY3RpdmVDYXJkRGlzY291bnQocHJvZHVjdCk7CiAgcmV0dXJuIGRpc2NvdW50ID09PSBudWxsID8gcHJpY2UgOiBwcmljZSAtIGRpc2NvdW50Owp9")
)
$priceSummary = [System.Text.Encoding]::UTF8.GetString(
  [System.Convert]::FromBase64String("ZnVuY3Rpb24gUHJpY2VTdW1tYXJ5KHsgcHJvZHVjdCB9OiB7IHByb2R1Y3Q6IFJlbnRhbFByb2R1Y3QgfSkgewogIGNvbnN0IGRpc2NvdW50ID0gZWZmZWN0aXZlQ2FyZERpc2NvdW50KHByb2R1Y3QpOwogIGNvbnN0IGZpbmFsUHJpY2UgPSBjYWxjdWxhdGVkRmluYWxQcmljZShwcm9kdWN0KTsKICBjb25zdCBoYXNEaXNjb3VudCA9CiAgICBwcm9kdWN0Lm1vbnRobHlQcmljZSAhPT0gbnVsbCAmJgogICAgZGlzY291bnQgIT09IG51bGwgJiYKICAgIGZpbmFsUHJpY2UgIT09IG51bGwgJiYKICAgIGZpbmFsUHJpY2UgPCBwcm9kdWN0Lm1vbnRobHlQcmljZTsKCiAgcmV0dXJuICgKICAgIDxkaXYgY2xhc3NOYW1lPSJtdC01IGJvcmRlci10IGJvcmRlci1zbGF0ZS0xMDAgcHQtNCI+CiAgICAgIDxkaXYgY2xhc3NOYW1lPSJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZ2FwLTMiPgogICAgICAgIDxzcGFuIGNsYXNzTmFtZT0idGV4dC14cyBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAiPuyblCDquLDrs7gg66CM7YOI66OMPC9zcGFuPgogICAgICAgIDxzdHJvbmcgY2xhc3NOYW1lPSJ0YWJ1bGFyLW51bXMgdGV4dC1bMTVweF0gZm9udC1leHRyYWJvbGQgdGV4dC1zbGF0ZS05NTAiPgogICAgICAgICAge2Zvcm1hdFByaWNlKHByb2R1Y3QubW9udGhseVByaWNlKX0KICAgICAgICA8L3N0cm9uZz4KICAgICAgPC9kaXY+CgogICAgICB7aGFzRGlzY291bnQgPyAoCiAgICAgICAgPGRpdiBjbGFzc05hbWU9Im10LTIgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC0zIj4KICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0idGV4dC14cyBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAiPgogICAgICAgICAgICDsoJztnLTsubTrk5wg7LWc64yAIO2VoOyduAogICAgICAgICAgPC9zcGFuPgogICAgICAgICAgPHN0cm9uZyBjbGFzc05hbWU9InRhYnVsYXItbnVtcyB0ZXh0LVsxNHB4XSBmb250LWV4dHJhYm9sZCB0ZXh0LWVtZXJhbGQtNjAwIj4KICAgICAgICAgICAgLXtkaXNjb3VudC50b0xvY2FsZVN0cmluZygia28tS1IiKX3sm5AKICAgICAgICAgIDwvc3Ryb25nPgogICAgICAgIDwvZGl2PgogICAgICApIDogKAogICAgICAgIDxwIGNsYXNzTmFtZT0ibXQtMiB0ZXh0LXJpZ2h0IHRleHQtWzExcHhdIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS00MDAiPgogICAgICAgICAg7ZWg7J24IOyghCDquLDrs7jsmpTquIgg6riw7KSACiAgICAgICAgPC9wPgogICAgICApfQoKICAgICAgPGRpdiBjbGFzc05hbWU9Im10LTQgcm91bmRlZC0yeGwgYmctc2xhdGUtOTUwIHB4LTQgcHktMy41IHRleHQtd2hpdGUiPgogICAgICAgIDxkaXYgY2xhc3NOYW1lPSJmbGV4IGl0ZW1zLWVuZCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTMiPgogICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSJwYi0wLjUgdGV4dC1bMTFweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtNDAwIj4KICAgICAgICAgICAge2hhc0Rpc2NvdW50ID8gIuy5tOuTnCDtlaDsnbgg7KCB7JqpIOyLnCDsmIjsg4EiIDogIuyblCDsmIjsg4Eg66CM7YOI66OMIn0KICAgICAgICAgIDwvc3Bhbj4KICAgICAgICAgIDxwIGNsYXNzTmFtZT0id2hpdGVzcGFjZS1ub3dyYXAiPgogICAgICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT0idGFidWxhci1udW1zIHRleHQtWzI0cHhdIGZvbnQtZXh0cmFib2xkIHRyYWNraW5nLVstMC4wNWVtXSB0ZXh0LWVtZXJhbGQtNDAwIj4KICAgICAgICAgICAgICB7KGZpbmFsUHJpY2UgPz8gcHJvZHVjdC5tb250aGx5UHJpY2UgPz8gMCkudG9Mb2NhbGVTdHJpbmcoImtvLUtSIil9CiAgICAgICAgICAgIDwvc3Ryb25nPgogICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9Im1sLTEgdGV4dC14cyBmb250LWJvbGQgdGV4dC1lbWVyYWxkLTQwMCI+CiAgICAgICAgICAgICAg7JuQL+yblAogICAgICAgICAgICA8L3NwYW4+CiAgICAgICAgICA8L3A+CiAgICAgICAgPC9kaXY+CiAgICAgIDwvZGl2PgogICAgPC9kaXY+CiAgKTsKfQ==")
)

$logicPattern = '(?s)function effectiveCardDiscount\(product: RentalProduct\) \{.*?\n\}\s*function calculatedFinalPrice\(product: RentalProduct\) \{.*?\n\}'
$logicMatch = [System.Text.RegularExpressions.Regex]::Match($content, $logicPattern)
if (-not $logicMatch.Success) {
  throw "The rental price-calculation block was not found."
}
$content = $content.Substring(0, $logicMatch.Index) +
  $logic +
  $content.Substring($logicMatch.Index + $logicMatch.Length)

$summaryPattern = '(?s)function PriceSummary\(\{ product \}: \{ product: RentalProduct \}\) \{.*?\n\}\s*function ProductCard'
$summaryMatch = [System.Text.RegularExpressions.Regex]::Match($content, $summaryPattern)
if (-not $summaryMatch.Success) {
  throw "The PriceSummary block was not found."
}
$content = $content.Substring(0, $summaryMatch.Index) +
  $priceSummary +
  [Environment]::NewLine +
  [Environment]::NewLine +
  "function ProductCard" +
  $content.Substring($summaryMatch.Index + $summaryMatch.Length)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($platformPath, $content, $utf8NoBom)

Write-Host "Applied: real rental images, verified catalog filtering, and usable estimates."
