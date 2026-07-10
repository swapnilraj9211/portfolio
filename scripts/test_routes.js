const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3005';

const routes = [
  '/',
  '/about',
  '/login',
  '/hostel-services',
  '/noticeBoard',
  '/signup',
];

async function checkRoutes() {
  console.log('🔍 Starting Website Health Check...\n');
  let successCount = 0;
  let failCount = 0;

  for (const route of routes) {
    try {
      const start = Date.now();
      const res = await fetch(`${BASE_URL}${route}`);
      const duration = Date.now() - start;
      
      if (res.ok) {
        console.log(`✅ [200] ${route.padEnd(20)} - ${duration}ms`);
        successCount++;
      } else {
        console.log(`❌ [${res.status}] ${route.padEnd(20)} - ${res.statusText}`);
        failCount++;
      }
    } catch (err) {
      console.log(`❌ [ERR] ${route.padEnd(20)} - ${err.message}`);
      failCount++;
    }
  }

  // Check API route
  console.log('\n🔍 Checking API Status...');
  try {
      // Sending empty body to verify it handles bad request gracefully
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({})
      });
      // 400 is expected for empty body, meaning endpoint is reachable
      if(res.status === 400 || res.status === 200) {
          console.log(`✅ API /api/auth/login is reachable (Status: ${res.status})`);
      } else {
          console.log(`❌ API /api/auth/login returned unexpected status: ${res.status}`);
      }
  } catch(err) {
      console.log(`❌ API Error: ${err.message}`);
  }

  console.log(`\nResults: ${successCount} passed, ${failCount} failed.`);
}

checkRoutes();
