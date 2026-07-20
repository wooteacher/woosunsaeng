$ErrorActionPreference = "Stop"

$target = Join-Path $PSScriptRoot "components\rental\RentalPlatform.tsx"

if (-not (Test-Path $target)) {
  throw "RentalPlatform.tsx was not found."
}

$content = [System.IO.File]::ReadAllText(
  $target,
  [System.Text.Encoding]::UTF8
)

$content = [System.Text.RegularExpressions.Regex]::Replace(
  $content,
  'setPurpose\("[^"]*"\);',
  'setPurpose("\uC804\uCCB4");'
)

$content = [System.Text.RegularExpressions.Regex]::Replace(
  $content,
  'setManagement\("[^"]*"\);',
  'setManagement("\uC804\uCCB4");'
)

$content = [System.Text.RegularExpressions.Regex]::Replace(
  $content,
  'setPrice\("[^"]*"\);',
  'setPrice("\uC804\uCCB4");'
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($target, $content, $utf8NoBom)

Write-Host "Applied: fixed rental filter strings."
