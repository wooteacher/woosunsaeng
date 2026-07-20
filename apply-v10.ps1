$ErrorActionPreference = "Stop"

$target = Join-Path $PSScriptRoot "components\internet\FinalEstimate.tsx"

if (-not (Test-Path $target)) {
  throw "FinalEstimate.tsx 파일을 찾을 수 없습니다: $target"
}

$content = Get-Content -LiteralPath $target -Raw -Encoding UTF8
$content = $content -replace "`r`n", "`n"

$old = @'
            <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
              <button
                type="button"
                onClick={() => setConsultationOpen(true)}
                className="flex h-10 items-center justify-center gap-1.5 rounded-[13px] bg-emerald-500 px-3 text-[12px] font-bold transition hover:bg-emerald-400"
              >
                <PhoneCall size={15} strokeWidth={2.2} />
                상담 연결
              </button>
              <a
                href={applyUrl}
                className="flex h-10 items-center justify-center gap-1.5 rounded-[13px] border border-white/[0.11] bg-white/[0.055] px-3 text-[12px] font-bold transition hover:bg-white/[0.09]"
              >
                <FilePenLine size={15} strokeWidth={2.2} />
                가입 신청
              </a>
            </div>
'@

$new = @'
            <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
              <a
                href={applyUrl}
                className="flex h-10 items-center justify-center gap-1.5 rounded-[13px] bg-emerald-500 px-3 text-[12px] font-bold transition hover:bg-emerald-400"
              >
                <FilePenLine size={15} strokeWidth={2.2} />
                가입 신청
              </a>
              <button
                type="button"
                onClick={() => setConsultationOpen(true)}
                className="flex h-10 items-center justify-center gap-1.5 rounded-[13px] border border-white/[0.11] bg-white/[0.055] px-3 text-[12px] font-bold transition hover:bg-white/[0.09]"
              >
                <PhoneCall size={15} strokeWidth={2.2} />
                상담 연결
              </button>
            </div>
'@

if ($content.Contains($new)) {
  Write-Host "최종견적 버튼 순서가 이미 적용되어 있습니다." -ForegroundColor Green
  exit 0
}

if (-not $content.Contains($old)) {
  throw "최종견적 버튼 영역을 찾지 못했습니다. FinalEstimate.tsx 내용을 확인해주세요."
}

$content = $content.Replace($old, $new)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($target, $content, $utf8NoBom)
Write-Host "적용 완료: 가입 신청(왼쪽) / 상담 연결(오른쪽)" -ForegroundColor Green
