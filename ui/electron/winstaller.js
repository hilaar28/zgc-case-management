const electronInstaller = require('electron-winstaller');
const fs = require('fs/promises');



(async () => {
   try {

      // get name
      const packageJson = await fs.readFile(`${__dirname}/package.json`, 'utf-8');
      const { name } = JSON.parse(packageJson);

      // create installer
      await electronInstaller.createWindowsInstaller({
         appDirectory: `${__dirname}/build/${name}-win-32-x64`,
         outputDirectory: `${__dirname}/dist/`,
      });

      console.log('Installer created!');
      
   } catch (e) {
      console.log(`No dice: ${e.message}`);
   }
})();