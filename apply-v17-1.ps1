$ErrorActionPreference = "Stop"

$target = Join-Path $PSScriptRoot "components\rental\RentalPlatform.tsx"

if (-not (Test-Path $target)) {
  throw "RentalPlatform.tsx was not found."
}

$content = [System.IO.File]::ReadAllText(
  $target,
  [System.Text.Encoding]::UTF8
)

$old = @'
function effectiveCardDiscount(product: RentalProduct) {
  if (product.monthlyPrice === null || product.maxCardDiscount === null) {
    return product.maxCardDiscount;
  }

  return Math.min(product.monthlyPrice, product.maxCardDiscount);
}
'@

$new = @'
function effectiveCardDiscount(product: RentalProduct) {
  if (product.monthlyPrice === null) return null;
  if (product.maxCardDiscount === null) return 0;

  return Math.min(product.monthlyPrice, product.maxCardDiscount);
}
'@

if ($content.Contains($old)) {
  $content = $content.Replace($old, $new)
}
else {
  $pattern = '(?s)function effectiveCardDiscount\(product: RentalProduct\) \{.*?\n\}'
  if (-not [System.Text.RegularExpressions.Regex]::IsMatch($content, $pattern)) {
    throw "effectiveCardDiscount was not found."
  }
  $content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $new, 1)
}

$content = $content.Replace(
  'discount === null ? "\uC870\uAC74 \uD655\uC778" : `-${discount.toLocaleString("ko-KR")}\uC6D0`',
  'discount === null ? "\uC694\uAE08 \uD655\uC778 \uC911" : discount === 0 ? "\uD560\uC778 \uBBF8\uC801\uC6A9" : `-${discount.toLocaleString("ko-KR")}\uC6D0`'
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($target, $content, $utf8NoBom)

Write-Host "Applied: fixed rental images and estimate display."
