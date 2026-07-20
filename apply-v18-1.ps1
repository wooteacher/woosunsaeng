$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$patchRoot = Join-Path $root "patch"
$platformPath = Join-Path $root "components\rental\RentalPlatform.tsx"

if (-not (Test-Path $patchRoot)) {
  throw "The patch folder was not found."
}

if (-not (Test-Path $platformPath)) {
  throw "RentalPlatform.tsx was not found."
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

$catalogImageSource = Join-Path $patchRoot "public\rental\catalog"
$catalogImageDestination = Join-Path $root "public\rental\catalog"
New-Item -ItemType Directory -Force -Path $catalogImageDestination | Out-Null
Copy-Item -Force (Join-Path $catalogImageSource "*") $catalogImageDestination

$fallbackImageSource = Join-Path $patchRoot "public\rental\fallback"
$fallbackImageDestination = Join-Path $root "public\rental\fallback"
New-Item -ItemType Directory -Force -Path $fallbackImageDestination | Out-Null
Copy-Item -Force (Join-Path $fallbackImageSource "*") $fallbackImageDestination

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

Write-Host "Applied: offline rental images and usable estimates."
