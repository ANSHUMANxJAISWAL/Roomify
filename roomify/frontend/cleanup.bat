@echo off
echo Removing unused files...

echo Removing components...
del "src\components\AuthTest.tsx"

rmdir /s /q "src\contexts"
rmdir /s /q "src\hooks"
rmdir /s /q "src\lib"

rmdir /s /q "src\pages\auth"
del "src\pages\Chores.tsx"
del "src\pages\Dashboard.tsx"
del "src\pages\Expenses.tsx"
del "src\pages\Onboarding.tsx"
del "src\pages\Profile.tsx"
del "src\pages\Reminders.tsx"
del "src\pages\Roommates.tsx"
del "src\pages\Rooms.tsx"
del "src\pages\Settings.tsx"
del "src\pages\TestPage.tsx"

rmdir /s /q "src\services"
rmdir /s /q "src\types"
rmdir /s /q "src\utils"

echo Cleanup complete!
