const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { exec } = require('child_process');

//const tempDir = path.join(__dirname, '..', 'temp');
const tempDir = 'C:/code-exec-temp';
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// Convert to Docker-friendly path
const toDockerPath = (windowsPath) => {
  return windowsPath.replace(/\\/g, '/').replace('C:', '/c');
};

const executeCode = (language, code) => {
  return new Promise((resolve, reject) => {
    //if (language !== 'python') return reject('Unsupported language');
    // console.log('Here:');
    const jobId = uuid();
    let filename, image, containerPath;
    //console.log('language:', language);

     if (language === 'python') {
      filename = `${jobId}.py`;
      image = 'python-runner';
      containerPath = '/app/code.py';
    } else if (language === 'javascript') {
      //console.log('language:', language);
      filename = `${jobId}.js`;
      image = 'javascript-runner';
      containerPath = '/app/code.js';
    } else {
      return reject('Unsupported language');
    }

    //const filename = `${jobId}.py`;
    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, code, { encoding: 'utf8' });
    console.log('filePath:', filePath);

    
    const dockerCmd = `docker run --rm -v "${filePath}:${containerPath}" ${image}`;
    console.log('Executing:', dockerCmd);
    
    //const dockerFilePath = toDockerPath(filePath);
    //console.log('dockerFilePath:', dockerFilePath);
    //const dockerCmd = `docker run --rm -v "${dockerFilePath}:/app/code.py" python-runner`;

    //console.log(`Executing: ${dockerCmd}`);

    exec(dockerCmd, { timeout: 5000 }, (error, stdout, stderr) => {
      // Clean up
      fs.unlinkSync(filePath);

       //console.log('stdout:', stdout);
      if (error) {
        console.error('Execution Error:', error);
        return resolve(stderr || error.message);
      }
      resolve(stdout);
    });
  });
};

module.exports = executeCode;
