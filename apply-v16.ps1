$ErrorActionPreference = "Stop"

$target = Join-Path $PSScriptRoot "components\rental\RentalPlatform.tsx"

if (-not (Test-Path $target)) {
  throw "RentalPlatform.tsx was not found."
}

$content = [System.IO.File]::ReadAllText(
  $target,
  [System.Text.Encoding]::UTF8
)

# Replace the quick-category render block from v15.
$quickPattern = '(?s)<RentalQuickCategories\s+selected=\{category\}.*?\/>'
$quickReplacement = @'
<RentalQuickCategories
            selected={category}
            onSelect={(nextCategory) => {
              changeCategory(nextCategory);
              setQuery("");
              setPurpose("\uC804\uCCB4");
              setManagement("\uC804\uCCB4");
              setPrice("\uC804\uCCB4");

              window.requestAnimationFrame(() => {
                document
                  .getElementById("rental-products")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              });
            }}
            onConsultCategory={(label) => {
              setConsultProduct({
                id: `quick-consult-${label}`,
                category: "\uC0DD\uD65C\uAC00\uC804",
                brand: "\uC6B0\uC120\uC0DD",
                name: `${label} \uB80C\uD0C8 \uB9DE\uCDA4 \uC0C1\uB2F4`,
                modelName: "\uC0C1\uB2F4 \uD6C4 \uC81C\uD488\uACFC \uC870\uAC74 \uC548\uB0B4",
                summary:
                  "\uC6D0\uD558\uB294 \uD06C\uAE30, \uC124\uCE58 \uACF5\uAC04, \uC608\uC0B0\uC5D0 \uB9DE\uCDB0 \uC81C\uD488\uC744 \uC548\uB0B4\uD569\uB2C8\uB2E4.",
                monthlyPrice: null,
                maxCardDiscount: null,
                finalPrice: null,
                contracts: ["\uC0C1\uB2F4 \uD655\uC778"],
                management: ["\uC124\uCE58\u00B7A/S \uC870\uAC74 \uD655\uC778"],
                features: [label, "\uB9DE\uCDA4 \uC0C1\uB2F4", "\uCD5C\uC2E0 \uC870\uAC74 \uC548\uB0B4"],
                purposes: ["\uC804\uCCB4"],
                sourceUrl: "#",
                verifiedAt: "2026-07-20",
                dataStatus: "catalog",
              });
            }}
          />
'@

if ([System.Text.RegularExpressions.Regex]::IsMatch($content, $quickPattern)) {
  $content = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    $quickPattern,
    $quickReplacement,
    1
  )
}
else {
  throw "RentalQuickCategories render block was not found."
}

# Remove the search-result count summary card.
$searchCountPattern = '(?s)\s*<div className="flex shrink-0 items-center justify-between gap-3 rounded-\[16px\] bg-emerald-50.*?allProducts\.length \|\| 80.*?</div>\s*</div>'
$content = [System.Text.RegularExpressions.Regex]::Replace(
  $content,
  $searchCountPattern,
  [Environment]::NewLine + "            </div>",
  1
)

# Remove the number badge from every category button.
$categoryCountPattern = '(?s)\s*<span\s+className=\{\[\s*"rounded-full px-2 py-0\.5 text-\[10px\]".*?\{categoryCounts\.get\(item\) \?\? 0\}\s*</span>'
$content = [System.Text.RegularExpressions.Regex]::Replace(
  $content,
  $categoryCountPattern,
  "",
  1
)

# Remove the product count under the filters while preserving the heading.
$productCountPattern = '(?s)\s*<strong className="ml-1 text-slate-950">\{products\.length\}.*?</strong>'
$content = [System.Text.RegularExpressions.Regex]::Replace(
  $content,
  $productCountPattern,
  "",
  1
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($target, $content, $utf8NoBom)

Write-Host "Applied: removed rental counts and fixed quick-category images."
