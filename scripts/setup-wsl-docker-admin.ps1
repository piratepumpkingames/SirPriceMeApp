#Requires -RunAsAdministrator
# Run: Right-click PowerShell -> Run as administrator, then:
#   Set-ExecutionPolicy -Scope Process Bypass -Force
#   & "C:\Projekti\SirPriceMeApp\scripts\setup-wsl-docker-admin.ps1"

$ErrorActionPreference = 'Stop'

Write-Host ""
Write-Host "=== SirPriceMe: WSL2 + Docker Desktop setup ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Installing Windows Subsystem for Linux (WSL2)..." -ForegroundColor Yellow
winget install --id Microsoft.WSL -e --accept-source-agreements --accept-package-agreements

Write-Host ""
Write-Host "[2/2] Installing Docker Desktop..." -ForegroundColor Yellow
winget install --id Docker.DockerDesktop -e --accept-source-agreements --accept-package-agreements

Write-Host ""
Write-Host "Installing default Ubuntu distro (if not present)..." -ForegroundColor Yellow
wsl --install -d Ubuntu --no-launch 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Ubuntu may already be installed or will be configured on first WSL launch." -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "=== Done (reboot required) ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Restart Windows."
Write-Host "  2. Open 'Docker Desktop' from Start menu and finish first-run setup."
Write-Host "  3. Docker Desktop -> Settings -> General -> Use WSL 2 based engine (ON)."
Write-Host "  4. Docker Desktop -> Settings -> Resources -> WSL Integration -> Ubuntu (ON)."
Write-Host "  5. Open 'Ubuntu' from Start menu, create your Linux user if prompted."
Write-Host "  6. In Ubuntu, run the post-install commands from the chat / ROADMAP."
Write-Host ""
