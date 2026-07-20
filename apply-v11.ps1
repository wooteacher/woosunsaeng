$ErrorActionPreference = "Stop"

$target = Join-Path $PSScriptRoot "components\internet\FinalEstimate.tsx"
if (-not (Test-Path -LiteralPath $target)) {
  throw "FinalEstimate.tsx was not found: $target"
}

$content = Get-Content -LiteralPath $target -Raw -Encoding UTF8
$content = $content -replace "`r`n", "`n"

$pattern = '(?s)(<div className="mt-auto grid grid-cols-2[^\"]*">\s*)(?<first><(?:button|a)\b.*?</(?:button|a)>)(?<gap>\s*)(?<second><(?:button|a)\b.*?</(?:button|a)>)(?<close>\s*</div>)'
$match = [regex]::Match($content, $pattern)

if (-not $match.Success) {
  throw "The FinalEstimate action button group could not be found."
}

$first = $match.Groups['first'].Value
$second = $match.Groups['second'].Value

if ($first.Contains('<FilePenLine') -and $second.Contains('<PhoneCall')) {
  Write-Host "FinalEstimate action order is already correct." -ForegroundColor Green
  exit 0
}

if (-not ($first.Contains('<PhoneCall') -and $second.Contains('<FilePenLine'))) {
  throw "The FinalEstimate action buttons were found in an unexpected structure."
}

$primaryClass = 'className="flex h-10 items-center justify-center gap-1.5 rounded-[13px] bg-emerald-500 px-3 text-[12px] font-bold transition hover:bg-emerald-400"'
$secondaryClass = 'className="flex h-10 items-center justify-center gap-1.5 rounded-[13px] border border-white/[0.11] bg-white/[0.055] px-3 text-[12px] font-bold transition hover:bg-white/[0.09]"'

$consult = $first.Replace($primaryClass, $secondaryClass)
$signup = $second.Replace($secondaryClass, $primaryClass)

$replacement = $match.Groups[1].Value + $signup + $match.Groups['gap'].Value + $consult + $match.Groups['close'].Value
$content = $content.Substring(0, $match.Index) + $replacement + $content.Substring($match.Index + $match.Length)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($target, $content, $utf8NoBom)
Write-Host "Applied: signup on the left, consultation on the right." -ForegroundColor Green
