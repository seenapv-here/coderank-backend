const { exec } = require('child_process');
const fs = require('fs');


exec('node code.js', (err, stdout, stderr) => {
    if (err) {
        console.error('Execution error:', err.message);
        process.exit(1);
    }

    if (stderr) {
        console.error('STDERR:\n' + stderr);
    }

    console.log(stdout);
});
