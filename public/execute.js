console.log("execute.js loaded");

const token = localStorage.getItem('token');

const executeCode = async () => {
  const language = document.getElementById('language').value;
  const code = document.getElementById('code').value;
  const resultElement = document.getElementById('output');
  resultElement.innerText = 'Submitting code...';

  try {
    // Step 1: Send code for execution
    const res = await fetch('http://localhost:3000/api/code/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ language, code })
    });

    const data = await res.json();

    if (!res.ok) {
      resultElement.innerText = `Error: ${data.message || 'Failed to send code'}`;
      return;
    }

    const requestId = data.requestId;
    resultElement.innerText = `Code submitted. Request ID: ${requestId}\nWaiting for result...`;

    // Step 2: Poll for status
    const pollStatus = async () => {
      const statusRes = await fetch(`http://localhost:3000/api/code/status/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const statusData = await statusRes.json();

      if (!statusRes.ok) {
        clearInterval(pollInterval);
        resultElement.innerText = `Error: ${statusData.error || 'Could not get status'}`;
        return;
      }

      if (statusData.status !== 'Pending') {
        clearInterval(pollInterval);
        resultElement.innerText = `Execution Status: ${statusData.status}\nOutput:\n${statusData.output}`;
      }
    };

    const pollInterval = setInterval(pollStatus, 2000); // Poll every 2 seconds

  } catch (err) {
    console.error('Execution error:', err);
    resultElement.innerText = 'Unexpected error occurred. Please try again.';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const runButton = document.getElementById('runCodeButton');
  if (runButton) {
    runButton.addEventListener('click', executeCode);
  } else {
    console.error('Button with id "runCodeButton" not found');
  }
});

