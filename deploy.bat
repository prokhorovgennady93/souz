@echo off
echo Starting deployment to GitHub and Ubuntu Server...
git add .
git commit -m "Auto-deploy update"
git push

echo.
echo Connecting to Ubuntu Server (192.168.2.137)...
echo Password is: 3ghZ3Z32
echo.
ssh -t grevelien@192.168.2.137 "if [ ! -d ~/souz ]; then echo 'Cloning repository...' && git clone https://github.com/prokhorovgennady93/souz.git ~/souz; fi; cd ~/souz && git pull && sudo docker compose up -d --build --remove-orphans"

echo.
echo Deployment finished!
pause
