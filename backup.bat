git remote add upstream https://github.com/dleuenbe/project2
git fetch upstream
git checkout master
git rebase upstream/master
git push -f origin master

pause