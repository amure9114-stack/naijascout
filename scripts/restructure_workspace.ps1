# Restructure the workspace into frontend/ and backend/ folders
# Run from the repository root: .\scripts\restructure_workspace.ps1

$root = Get-Location
$frontend = Join-Path $root 'frontend'

Write-Output "Creating frontend folder at: $frontend"
if (-not (Test-Path $frontend)) { New-Item -ItemType Directory -Path $frontend | Out-Null }

# Files and folders to move to frontend
$itemsToMove = @(
  'index.html',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'postcss.config.js',
  'tailwind.config.js',
  'src',
  'public',
  'node_modules'
)

foreach ($item in $itemsToMove) {
  $srcPath = Join-Path $root $item
  if (Test-Path $srcPath) {
    $destPath = Join-Path $frontend $item
    Write-Output "Moving $item -> frontend/"
    try {
      Move-Item -Path $srcPath -Destination $frontend -Force
    } catch {
      Write-Warning ("Failed to move {0}: {1}" -f $item, $_.Exception.Message)
    }
  } else {
    Write-Output "Skipping: $item (not found)"
  }
}

Write-Output "Done. Review the repository root and frontend/ to confirm files moved."
Write-Output "Note: backend/ already exists and will remain at root. Update any build scripts or CI references if necessary."