@echo off
echo "# school_web_portal" > README.md
git init
git add .
git commit -m "Initial commit: School ERP Frontend"
git branch -M main
git remote add origin https://github.com/krishna-tech1/school_web_portal.git
git push -u origin main
