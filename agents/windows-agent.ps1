param (
    [string]$TargetIP # Supply the IP as a parameter
)

# Fetch hostname
$Hostname = $env:COMPUTERNAME

# Fetch operating system info
$OS = (Get-WmiObject -Class Win32_OperatingSystem).Caption

# Fetch primary IP address
$IP = (Get-NetIPAddress -AddressFamily IPv4 -PrefixOrigin Dhcp).IPAddress

# Get username
$Username = (whoami).Split('\')[-1]
Write-Host "Username: $($Username)"

# Fetch location using an API
$LocationResponse = Invoke-RestMethod -Uri "http://ip-api.com/json/"
$Location = $LocationResponse.city


# Generate JSON payload
$Json = @{
    name     = $Hostname
    metadata = @{
        OS       = $OS
        IP       = $IP
        location = $Location
        username = $Username
    }
} | ConvertTo-Json -Depth 2

# Output JSON
Write-Host "Generated JSON:"
Write-Host $Json

# If TargetIP is provided, make a POST request
if ($TargetIP) {
    Write-Host "Making POST request to http://$($TargetIP):4200/api/assets..."
    $Response = Invoke-RestMethod -Method Post -Uri "http://$($TargetIP):4200/api/assets" -Body $Json -ContentType "application/json"
    Write-Host "Response from server:"
    Write-Host $Response
}

# Optionally, save JSON to a file
$Json | Out-File -FilePath .\server_info.json -Encoding utf8
Write-Host "JSON saved to server_info.json"
