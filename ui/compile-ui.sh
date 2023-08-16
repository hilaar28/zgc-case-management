
# compile react
npm run build

# copy build folder to electon www
rm -rf electron/www
cp -r build electron/www/
