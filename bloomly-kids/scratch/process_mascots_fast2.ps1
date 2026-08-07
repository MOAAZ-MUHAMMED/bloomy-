$source = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;

public class ImageProcessor {
    public static void RemoveWhiteBackground(string srcPath, string destPath) {
        using (Bitmap bmp = new Bitmap(srcPath)) {
            Bitmap temp = new Bitmap(bmp.Width, bmp.Height, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(temp)) {
                g.DrawImage(bmp, 0, 0);
            }
            
            for (int x = 0; x < temp.Width; x++) {
                for (int y = 0; y < temp.Height; y++) {
                    Color pixel = temp.GetPixel(x, y);
                    if (pixel.R > 240 && pixel.G > 240 && pixel.B > 240) {
                        temp.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                    }
                }
            }
            temp.Save(destPath, ImageFormat.Png);
            temp.Dispose();
        }
    }
}
"@

# Avoid redeclaring class if already loaded in this session, but in new PS process it will load.
try {
    Add-Type -TypeDefinition $source -ReferencedAssemblies "System.Drawing"
} catch {}

$images = @(
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\isolated_apple_1786015538891.jpg"; dest = "apple_idle.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\apple_eyes_closed_1786016171246.jpg"; dest = "apple_blink.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\apple_waving_1786016183638.jpg"; dest = "apple_wave_right.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\apple_wave_left_1786016880494.jpg"; dest = "apple_wave_left.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\isolated_orange_1786015546473.jpg"; dest = "orange_idle.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\orange_eyes_closed_1786016194674.jpg"; dest = "orange_blink.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\orange_waving_1786016202422.jpg"; dest = "orange_wave_right.png" },
    @{ src = "C:\Users\omar\.gemini\antigravity\brain\5fd8b6a1-6e6d-4c33-bd6a-f0764b75176e\orange_wave_left_1786016891521.jpg"; dest = "orange_wave_left.png" }
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
        [ImageProcessor]::RemoveWhiteBackground($srcPath, $destPath)
    } else {
        Write-Warning "Source not found: $srcPath"
    }
}

Write-Host "All mascots (including secondary waving frames) processed successfully!"
