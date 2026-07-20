$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$target = Join-Path $root "components\rental\RentalPlatform.tsx"

if (-not (Test-Path $target)) {
  throw "RentalPlatform.tsx was not found."
}

$content = [System.IO.File]::ReadAllText(
  $target,
  [System.Text.Encoding]::UTF8
)

$importLine = 'import RentalQuickCategories from "@/components/rental/RentalQuickCategories";'

if (-not $content.Contains($importLine)) {
  $bannerImport = 'import RentalBannerSlider from "@/components/rental/RentalBannerSlider";'

  if ($content.Contains($bannerImport)) {
    $content = $content.Replace(
      $bannerImport,
      $bannerImport + [Environment]::NewLine + $importLine
    )
  }
  else {
    $serviceImport = 'import { fetchRentalProducts } from "@/services/rental-products.service";'

    if (-not $content.Contains($serviceImport)) {
      throw "A safe import anchor was not found."
    }

    $content = $content.Replace(
      $serviceImport,
      $importLine + [Environment]::NewLine + $serviceImport
    )
  }
}

$componentMarker = '<RentalQuickCategories'

if (-not $content.Contains($componentMarker)) {
  $bannerRender = '<RentalBannerSlider />'

  if (-not $content.Contains($bannerRender)) {
    throw "RentalBannerSlider render anchor was not found."
  }

  $quickRender = @'
<RentalBannerSlider />

          <RentalQuickCategories
            selected={category}
            counts={categoryCounts}
            onSelect={(nextCategory) => {
              changeCategory(nextCategory);
              setQuery("");
              setPurpose("전체");
              setManagement("전체");
              setPrice("전체");

              window.requestAnimationFrame(() => {
                document
                  .getElementById("rental-products")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              });
            }}
          />
'@

  $content = $content.Replace($bannerRender, $quickRender)
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($target, $content, $utf8NoBom)

Write-Host "Applied: rental quick recommendation cards."
