document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const userData = {
        fname: document.getElementById('fn').value,
        lname: document.getElementById('ln').value,
        email: document.getElementById('mailid').value,
        password: document.getElementById('newpassword').value,
        conformPassword: document.getElementById('conform-password').value,
        gender: document.querySelector('input[name="gen1"]:checked') ? 'Male' : 'Female',
        hobbies: [],
        sourceOfIncome: document.getElementById('level').value,
        income: document.getElementById('income').value,
        age: document.getElementById('age').value,
        bio: document.querySelector('textarea').value
      };
      document.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
        userData.hobbies.push(checkbox.id);
      });
      fetch('https://reqres.in/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Clear form data
        form.reset();
      })
      .catch(error => console.error('Error:', error));
  
      // Store data in database (example using IndexedDB)
      const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      const dbRequest = indexedDB.open('userData', 1);
  
      dbRequest.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore('users', { keyPath: 'email' });
      };
  
      dbRequest.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction('users', 'readwrite');
        const objectStore = transaction.objectStore('users');
        objectStore.add(userData);
      };
  
      dbRequest.onerror = function(event) {
        console.error('Error:', event);
      };
    });
  });