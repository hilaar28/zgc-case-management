
# replace the constants symlink
# link with actual file
# (windows is having issues with it)
BE_CONSTANTS_PATH="src/backend-constants.js"
mv $BE_CONSTANTS_PATH temp.js
cp ../api/constants.js $BE_CONSTANTS_PATH

# compile react
npm run build

# copy build folder to electon www
rm -rf electron/www
cp -r build electron/www/

# restoring the symlink
rm $BE_CONSTANTS_PATH
mv temp.js $BE_CONSTANTS_PATH
