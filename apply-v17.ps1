$ErrorActionPreference = "Stop"

$target = Join-Path $PSScriptRoot "components\rental\RentalPlatform.tsx"

if (-not (Test-Path $target)) {
  throw "RentalPlatform.tsx was not found."
}

$content = [System.IO.File]::ReadAllText(
  $target,
  [System.Text.Encoding]::UTF8
)

if (-not $content.Contains("  Refrigerator,")) {
  $content = $content.Replace(
    "  PackageOpen,",
    "  PackageOpen," + [Environment]::NewLine +
    "  Refrigerator," + [Environment]::NewLine +
    "  Snowflake," + [Environment]::NewLine +
    "  Tv," + [Environment]::NewLine +
    "  Wind,"
  )
}

$quickImport = 'import RentalQuickCategories from "@/components/rental/RentalQuickCategories";'

if (-not $content.Contains($quickImport)) {
  $bannerImport = 'import RentalBannerSlider from "@/components/rental/RentalBannerSlider";'

  if ($content.Contains($bannerImport)) {
    $content = $content.Replace(
      $bannerImport,
      $bannerImport + [Environment]::NewLine + $quickImport
    )
  }
  else {
    $serviceImport = 'import { fetchRentalProducts } from "@/services/rental-products.service";'

    if (-not $content.Contains($serviceImport)) {
      throw "A safe import anchor was not found."
    }

    $content = $content.Replace(
      $serviceImport,
      $quickImport + [Environment]::NewLine + $serviceImport
    )
  }
}

if (-not $content.Contains('TV: { icon: Tv, short: "TV" }')) {
  $metaPattern = '(?m)^(\s*[^:\r\n]+:\s*\{\s*icon:\s*PackageOpen,\s*short:\s*"[^"]+"\s*\},)\s*$'
  $metaReplacement = @'
$1
  TV: { icon: Tv, short: "TV" },
  "\uB0C9\uC7A5\uACE0": { icon: Refrigerator, short: "\uB0C9\uC7A5\uACE0" },
  "\uC5D0\uC5B4\uCEE8": { icon: Wind, short: "\uC5D0\uC5B4\uCEE8" },
  "\uB0C9\uB3D9\uACE0": { icon: Snowflake, short: "\uB0C9\uB3D9\uACE0" },
'@

  $content = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    $metaPattern,
    $metaReplacement,
    1
  )
}

$quickPattern = '(?s)<RentalQuickCategories\s+selected=\{category\}.*?\s*/>'
$quickReplacement = @'
<RentalQuickCategories
            selected={category}
            onSelect={(nextCategory) => {
              changeCategory(nextCategory);
              setQuery("");

              window.requestAnimationFrame(() => {
                document
                  .getElementById("rental-products")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
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

$pillPattern = '(?s)\s*<div className="flex gap-2 overflow-x-auto pb-2">\s*\{rentalCategories\.map\(.*?\)\}\s*</div>'
$content = [System.Text.RegularExpressions.Regex]::Replace(
  $content,
  $pillPattern,
  "",
  1
)

$filterPattern = '(?s)\s*<div className="mt-5 rounded-\[24px\] border border-slate-200 bg-white p-4.*?<button\s+type="button"\s+onClick=\{resetFilters\}.*?</button>\s*</div>\s*</div>'
$content = [System.Text.RegularExpressions.Regex]::Replace(
  $content,
  $filterPattern,
  "",
  1
)

$headingPattern = '(?s)\s*<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">.*?<select\s+value=\{sort\}.*?</select>.*?</div>\s*</div>'
$content = [System.Text.RegularExpressions.Regex]::Replace(
  $content,
  $headingPattern,
  "",
  1
)

$searchCountPattern = '(?s)\s*<div className="flex shrink-0 items-center justify-between gap-3 rounded-\[16px\] bg-emerald-50.*?allProducts\.length \|\| 80.*?</div>\s*</div>'
$content = [System.Text.RegularExpressions.Regex]::Replace(
  $content,
  $searchCountPattern,
  [Environment]::NewLine + "            </div>",
  1
)

$content = $content.Replace(
  '<div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">',
  '<div className="mt-3 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">'
)
$content = $content.Replace(
  '<div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">',
  '<div className="mt-3 grid gap-5 md:grid-cols-2 xl:grid-cols-3">'
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($target, $content, $utf8NoBom)

Write-Host "Applied: simplified rental categories and expanded verified products."
