# CertiFlow Local Static HTTP Server
$port = 5500
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "CertiFlow Server is running at: http://localhost:$port/"
} catch {
    $port = 5501
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Host "CertiFlow Server is running at: http://localhost:$port/"
}

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.csv'  = 'text/csv; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path) -or $path -eq '/') {
            $path = 'index.html'
        }

        # Prevent directory traversal
        $filePath = Join-Path $PSScriptRoot $path
        $fullPath = [System.IO.Path]::GetFullPath($filePath)
        $rootPath = [System.IO.Path]::GetFullPath($PSScriptRoot)

        if (-not $fullPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
            $response.ContentType = $mime
            $response.Headers.Add("Access-Control-Allow-Origin", "*")

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $bytes.Length

            if ($request.HttpMethod -ne 'HEAD') {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msg.Length
            if ($request.HttpMethod -ne 'HEAD') {
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
        }
        $response.Close()
    } catch {
        # Continue loop on aborted client requests
    }
}
