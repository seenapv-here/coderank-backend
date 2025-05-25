const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { exec } = require('child_process');

const tempDir = 'C:/code-exec-temp';
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// Convert to Docker-friendly path
const toDockerPath = (windowsPath) => {
  return windowsPath.replace(/\\/g, '/').replace('C:', '/c');
};

const executeCode = (language, code) => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();
    let filename, image, containerPath;

    if (language === 'python') {
      filename = `${jobId}.py`;
      image = 'python-runner';
      containerPath = '/app/code.py';
    } else if (language === 'javascript') {
      filename = `${jobId}.js`;
      image = 'javascript-runner';
      containerPath = '/app/code.js';
    } else {
      return reject(new Error('Unsupported language'));
    }

    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, code, { encoding: 'utf8' });

    const dockerCmd = `docker run --rm --memory=128m --cpus=0.5 -v "${filePath}:${containerPath}" ${image}`;
    console.log('Executing:', dockerCmd);

    exec(dockerCmd, { timeout: 5000 }, (error, stdout, stderr) => {
      fs.unlinkSync(filePath); // Always clean up

      if (error) {
        if (error.killed) {
          return reject(new Error('Execution timed out'));
        } else {
          const errMsg = stderr || error.message || 'Unknown error occurred';
          return reject(new Error(errMsg.trim()));
        }
      }

      if (stderr && stderr.trim()) {
        return reject(new Error(stderr.trim()));
      }

      resolve(stdout.trim());
    });
  });
};

module.exports = executeCode;
