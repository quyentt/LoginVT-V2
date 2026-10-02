<#
    Static file server cho harness giả lập frontend LoginVT.
    Chạy:  powershell -ExecutionPolicy Bypass -File _harness\serve.ps1
    Dừng:  Ctrl+C
#>
param(
    [int]$Port = 8787,
    [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    # Phục vụ .aspx như HTML tĩnh để đo giao diện (thẻ <%= %> hiện ra dạng chữ,
    # nhưng cấu trúc và CSS vẫn áp dụng đúng).
    '.aspx' = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ttf'  = 'font/ttf'
    '.eot'  = 'application/vnd.ms-fontobject'
    '.otf'  = 'font/otf'
    '.map'  = 'application/json; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try { $listener.Start() } catch { Write-Host "Khong bind duoc cong $Port : $($_.Exception.Message)"; exit 1 }

Write-Host ""
Write-Host "  Harness dang chay:  http://localhost:$Port/_harness/" -ForegroundColor Green
Write-Host "  Web root:           $Root"
Write-Host "  Ctrl+C de dung."
Write-Host ""

$rootFull = (Resolve-Path $Root).Path

while ($listener.IsListening) {
    try { $ctx = $listener.GetContext() } catch { break }

    $rel = $ctx.Request.Url.LocalPath.TrimStart('/')
    if ($rel -eq '') { $rel = '_harness/index.html' }
    $rel = $rel -replace '/', '\'
    $path = Join-Path $rootFull $rel

    # Tep khong co o goc thi tim trong _harness: index-old.html phai chay o DUNG goc web
    # nhu indexi.aspx (duong dan tuong doi + lien ket "#..." cua Corei), nhung tep nam trong _harness.
    if (-not (Test-Path -LiteralPath $path)) {
        $alt = Join-Path (Join-Path $rootFull '_harness') $rel
        if (Test-Path -LiteralPath $alt -PathType Leaf) { $path = $alt }
    }

    # Chan directory traversal
    $ok = $false
    try {
        $resolved = (Resolve-Path -LiteralPath $path -ErrorAction Stop).Path
        if ($resolved.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)) { $ok = $true }
    } catch { $ok = $false }

    if ($ok -and (Test-Path -LiteralPath $resolved -PathType Container)) {
        $idx = Join-Path $resolved 'index.html'
        if (Test-Path -LiteralPath $idx) { $resolved = $idx } else { $ok = $false }
    }

    if ($ok) {
        try {
            $bytes = [System.IO.File]::ReadAllBytes($resolved)
            $ext = [System.IO.Path]::GetExtension($resolved).ToLower()
            if ($mime.ContainsKey($ext)) { $ct = $mime[$ext] } else { $ct = 'application/octet-stream' }
            $ctx.Response.ContentType = $ct
            $ctx.Response.StatusCode = 200
            $ctx.Response.Headers.Add('Cache-Control', 'no-store')
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host ("200  " + $ctx.Request.Url.LocalPath)
        } catch {
            $ctx.Response.StatusCode = 500
            Write-Host ("500  " + $ctx.Request.Url.LocalPath) -ForegroundColor Red
        }
    } else {
        $ctx.Response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - khong tim thay: " + $ctx.Request.Url.LocalPath)
        $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
        Write-Host ("404  " + $ctx.Request.Url.LocalPath) -ForegroundColor Yellow
    }
    $ctx.Response.OutputStream.Close()
}
$listener.Stop()
