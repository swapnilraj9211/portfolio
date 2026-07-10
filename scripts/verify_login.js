const fetch = require('node-fetch');

async function testLogin(role, identifier, password) {
  console.log(`Testing ${role} login...`);
  try {
    const response = await fetch('http://localhost:3005/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, identifier, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${role} Login SUCCESS`);
      console.log(`   Token: ${data.token ? 'Received' : 'Missing'}`);
      console.log(`   User: ${data.user.name} (${data.user.email || data.user.regNo})`);
    } else {
      console.log(`❌ ${role} Login FAILED: ${response.status}`);
      console.log(`   Message: ${data.message}`);
    }
  } catch (error) {
    console.error(`❌ ${role} Request Error:`, error.message);
  }
  console.log('---');
}

(async () => {
    // Student
    await testLogin('Student', '21105152003', 'password123');
    
    // Faculty
    await testLogin('Faculty', 'faculty@gec.ac.in', 'password123');
    
    // Academics
    await testLogin('Academics', 'academics@gec.ac.in', 'password123');
})();
