Add-Type -AssemblyName System.Drawing

$images = @(
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\isolated_apple_1786015538891.jpg"; dest = "apple_idle.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\apple_eyes_closed_1786016171246.jpg"; dest = "apple_blink.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\apple_waving_1786016183638.jpg"; dest = "apple_wave.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\isolated_orange_1786015546473.jpg"; dest = "orange_idle.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\orange_eyes_closed_1786016194674.jpg"; dest = "orange_blink.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\orange_waving_1786016202422.jpg"; dest = "orange_wave.png" }
)

$destFolder = "c:\Users\omar\Desktop\Huda-Nour-Site\bloomly-kids\public\assets\mascots"
if (!(Test-Path $destFolder)) {
    New-Item -ItemType Directory -Force -Path $destFolder
}

foreach ($img in $images) {
    $srcPath = $img.src
    $destPath = Join-Path $destFolder $img.dest
    
    if (Test-Path $srcPath) {
        Write-Host "Processing $srcPath -> $destPath"
        
        $bmp = New-Object System.Drawing.Bitmap($srcPath)
        
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            for ($y = 0; $y -lt $bmp.Height; $y++) {
                $pixel = $bmp.GetPixel($x, $y)
                # If R, G, B are all > 240, make it transparent
                if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) {
                    $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                }
            }
        }
        
        $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
    } else {
        Write-Warning "Source not found: $srcPath"
    }
}

Write-Host "All mascots processed successfully!"
