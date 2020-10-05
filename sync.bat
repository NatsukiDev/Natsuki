@echo off
set /p msg="Enter Commit Message: "
git pull origin master
git add .
git commit -m %msg%
git push origin master