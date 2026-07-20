$ErrorActionPreference = "Stop"

$target = Join-Path $PSScriptRoot "components\internet\FinalEstimate.tsx"
if (-not (Test-Path -LiteralPath $target)) {
  throw "FinalEstimate.tsx was not found: $target"
}

$content = Get-Content -LiteralPath $target -Raw -Encoding UTF8
$content = $content -replace "`r`n", "`n"

$groupPattern = '(?s)(<div className="mt-auto grid grid-cols-2[^\"]*">\s*)(?<first><(?:button|a)\b.*?</(?:button|a)>)(?<gap>\s*)(?<second><(?:button|a)\b.*?</(?:button|a)>)(?<close>\s*</div>)'
$match = [regex]::Match($content, $groupPattern)

if (-not $match.Success) {
  throw "The FinalEstimate action button group could not be found."
}

$first = $match.Groups['first'].Value
$second = $match.Groups['second'].Value

$signup = $null
$consult = $null

foreach ($item in @($first, $second)) {
  if ($item.Contains('<FilePenLine')) { $signup = $item }
  if ($item.Contains('<PhoneCall')) { $consult = $item }
}

if (-not $signup -or -not $consult) {
  throw "The signup or consultation action could not be identified."
}

$signupClass = 'className="flex h-10 items-center justify-center gap-1.5 rounded-[13px] border border-white/[0.11] bg-white/[0.055] px-3 font-sans text-[12px] font-bold leading-none tracking-[-0.01em] text-white transition hover:bg-white/[0.09]"'
$consultClass = 'className="flex h-10 items-center justify-center gap-1.5 rounded-[13px] bg-emerald-500 px-3 font-sans text-[12px] font-bold leading-none tracking-[-0.01em] text-white transition hover:bg-emerald-400"'

function Set-ActionClass([string]$element, [string]$newClass) {
  $updated = [regex]::Replace(
    $element,
    'className="[^"]*"',
    $newClass,
    1
  )

  if ($updated -eq $element) {
    throw "An action className could not be updated."
  }

  return $updated
}

$signup = Set-ActionClass $signup $signupClass
$consult = Set-ActionClass $consult $consultClass

# Keep the requested order: signup on the left, consultation on the right.
$replacement = $match.Groups[1].Value + $signup + $match.Groups['gap'].Value + $consult + $match.Groups['close'].Value
$content = $content.Substring(0, $match.Index) + $replacement + $content.Substring($match.Index + $match.Length)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($target, $content, $utf8NoBom)
Write-Host "Applied: unified fonts and swapped action colors." -ForegroundColor Green
