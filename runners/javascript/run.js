// const fs = require('fs');

// try {
//     console.log("Inside run.js");
//     const code = fs.readFileSync('/app/code.js', 'utf-8');
//     eval(code);
// } catch (err) {
//     console.error(err.message);
// }
const { exec } = require('child_process');
const fs = require('fs');

//console.log("Starting run.js");
//console.log("Running code.js...");

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
