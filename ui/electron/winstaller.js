const electronInstaller = require('electron-winstaller');
const fs = require('fs/promises');
const { glob } = require('glob');



(async () => {
   try {

      console.clear();

      // get name and description
      // from package.json
      const packageJson = await fs.readFile(`${__dirname}/package.json`, 'utf-8');
      const { name, description, } = JSON.parse(packageJson);

      // create installers
      const appDirBase = `${__dirname}/build`
      const dirs = await glob(`${appDirBase}/${name}-win32-*`);
      
      for (const i in dirs) {

         const appDirName = dirs[i]
            .split(/[\\/]{1}/)
            .pop();

         console.log(`Creating ${appDirName} installer...`);

         await electronInstaller.createWindowsInstaller({
            appDirectory: `${appDirBase}/${appDirName}`,
            outputDirectory: `${__dirname}/dist/${appDirName}`,
            description,
            exe: 'ZGC Case Management',
            noMsi: true,
         });

         console.log('Done.');

      }

      console.log('Installers created!');
      
   } catch (e) {
      console.log(`Error: ${e.message}`);
   }
})();