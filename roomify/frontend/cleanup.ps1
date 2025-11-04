# Cleanup script for unused files and directories

# Remove unused directories
$directoriesToRemove = @(
    "src/contexts",
    "src/hooks",
    "src/lib",
    "src/pages/auth",
    "src/services",
    "src/types",
    "src/utils"
)

# Remove unused files
$filesToRemove = @(
    "src/components/AuthTest.tsx",
    "src/pages/Chores.tsx",
    "src/pages/Dashboard.tsx",
    "src/pages/Expenses.tsx",
    "src/pages/Onboarding.tsx",
    "src/pages/Profile.tsx",
    "src/pages/Reminders.tsx",
    "src/pages/Roommates.tsx",
    "src/pages/Rooms.tsx",
    "src/pages/Settings.tsx",
    "src/pages/TestPage.tsx"
)

# Remove directories
foreach ($dir in $directoriesToRemove) {
    if (Test-Path $dir) {
        Write-Host "Removing directory: $dir"
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Remove files
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Write-Host "Removing file: $file"
        Remove-Item -Path $file -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Cleanup complete!"
