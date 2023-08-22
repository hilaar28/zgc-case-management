
# replace symlinks with actual files
# (windows is having issues with it)
BE_CONSTANTS_PATH="src/backend-constants.js"
SHARED_UTILS_PATH="src/shared-utils.js"
TEMPORARY_BE_CONSTANTS_PATH="backend-constants-temp.js"
TEMPORARY_SHARED_UTILS_PATH="shared-utils-temp.js"

mv $BE_CONSTANTS_PATH $TEMPORARY_BE_CONSTANTS_PATH
cp ../api/constants.js $BE_CONSTANTS_PATH
mv $SHARED_UTILS_PATH $TEMPORARY_SHARED_UTILS_PATH
cp ../api/shared-utils.js $SHARED_UTILS_PATH

# compile react
npm run build

# copy build folder to electon www
rm -rf electron/www
cp -r build electron/www/

# restoring symlinks
rm $BE_CONSTANTS_PATH
mv $TEMPORARY_BE_CONSTANTS_PATH $BE_CONSTANTS_PATH
rm $SHARED_UTILS_PATH
mv $TEMPORARY_SHARED_UTILS_PATH $SHARED_UTILS_PATH
