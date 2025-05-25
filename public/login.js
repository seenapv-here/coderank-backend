document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || 'Login failed');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId); // optional

    alert('Login successful!');
    window.location.href = '/execute.html'; // redirect after login
  } catch (err) {
    console.error(err);
    alert('Something went wrong. Please try again.');
  }
});
