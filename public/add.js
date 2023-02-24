const form = document.getElementById('add-form');
const errorMessage = document.getElementById('error-message');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nameInput = document.getElementById('name');
  const ageInput = document.getElementById('age');
  const name = nameInput.value.trim();
  const age = parseInt(ageInput.value.trim(), 10);
  if (!name || !age) {
    errorMessage.textContent = 'Please provide both name and age';
    return;
  }
  if (isNaN(age)) {
    errorMessage.textContent = 'Age must be a number';
    return;
  }
  const response = await fetch('/api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, age }),
  });
  if (!response.ok) {
    errorMessage.textContent = 'Failed to add data';
    return;
  }
  window.location.href = '/';
});