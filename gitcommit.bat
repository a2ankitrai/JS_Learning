@ECHO OFF 
echo:

echo Staging newly added or modified files... 
git add .
echo:

echo Commiting to local repository....
git commit -m %1
echo:

echo Configuring git username and user email...
git config user.name "a2ankitrai"
git config user.email a2.ankitrai@gmail.com
echo:

echo pushing to remote repository...
git push origin master
echo:

