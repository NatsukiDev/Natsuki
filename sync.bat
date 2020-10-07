@echo off
title Put quotes around your damn commit message
set /p msg="Enter Commit Message: "
title pulling...
git pull origin master
git add .
title commit...
git commit -m %msg%
title pushing...
git push origin master