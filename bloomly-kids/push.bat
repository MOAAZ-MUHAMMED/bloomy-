@echo off
cd ..
git add .
git commit -m "Fix typescript build errors"
git push origin main
echo Done!
pause
