const mongoose = require('mongoose');
const http = require('http');
const app = require('../server');

const PORT = 5001;

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const reqHeaders = { ...headers };
    let reqBody = '';
    if (body) {
      reqBody = typeof body === 'string' ? body : JSON.stringify(body);
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(reqBody);
    }
    
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: reqHeaders
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(reqBody);
    }
    req.end();
  });
}

async function runTests() {
  console.log('[Test] Starting server on port ' + PORT);
  const server = app.listen(PORT, async () => {
    console.log('[Test] Server running.');
    try {
      console.log('\n--- Test 1: OPTIONS /api/v1/datasets ---');
      const optRes = await makeRequest('OPTIONS', '/api/v1/datasets');
      console.log('Status:', optRes.statusCode);
      console.log('Allow Header:', optRes.headers['allow']);

      console.log('\n--- Test 2: HEAD /api/v1/datasets ---');
      const headRes = await makeRequest('HEAD', '/api/v1/datasets');
      console.log('Status:', headRes.statusCode);
      console.log('Content-Type:', headRes.headers['content-type']);
      console.log('X-Total-Count Header:', headRes.headers['x-total-count']);

      console.log('\n--- Test 3: GET /api/v1/datasets/random ---');
      const randRes = await makeRequest('GET', '/api/v1/datasets/random');
      console.log('Status:', randRes.statusCode);
      const randBody = JSON.parse(randRes.body);
      console.log('Success:', randBody.success);
      console.log('Random Dataset ID:', randBody.data ? randBody.data.id : 'None');

      console.log('\n--- Test 4: GET /api/v1/datasets/trending ---');
      const trendRes = await makeRequest('GET', '/api/v1/datasets/trending');
      console.log('Status:', trendRes.statusCode);
      const trendBody = JSON.parse(trendRes.body);
      console.log('Success:', trendBody.success);
      console.log('Trending Count:', trendBody.results);

      console.log('\n--- Test 5: GET /api/v1/datasets/recent ---');
      const recRes = await makeRequest('GET', '/api/v1/datasets/recent?limit=2');
      console.log('Status:', recRes.statusCode);
      const recBody = JSON.parse(recRes.body);
      console.log('Success:', recBody.success);
      console.log('Recent Count:', recBody.results);

      console.log('\n--- Test 6: GET /api/v1/datasets/recommendations ---');
      const recsRes = await makeRequest('GET', '/api/v1/datasets/recommendations');
      console.log('Status:', recsRes.statusCode);
      const recsBody = JSON.parse(recsRes.body);
      console.log('Success:', recsBody.success);

      console.log('\n--- Test 7: GET /api/v1/datasets/export/csv ---');
      const csvRes = await makeRequest('GET', '/api/v1/datasets/export/csv');
      console.log('Status:', csvRes.statusCode);
      console.log('Content-Type:', csvRes.headers['content-type']);
      console.log('Content-Disposition:', csvRes.headers['content-disposition']);
      console.log('CSV Preview (First 100 chars):', csvRes.body.substring(0, 100));

      console.log('\n--- Test 8: OPTIONS /api/v1/auth/login ---');
      const loginOpt = await makeRequest('OPTIONS', '/api/v1/auth/login');
      console.log('Status:', loginOpt.statusCode);
      console.log('Allow Header:', loginOpt.headers['allow']);

      console.log('\n--- Test 9: HEAD /api/v1/datasets/system/health ---');
      const healthHead = await makeRequest('HEAD', '/api/v1/datasets/system/health');
      console.log('Status:', healthHead.statusCode);

      console.log('\n[Test] All tests completed successfully!');
    } catch (err) {
      console.error('[Test] Error running tests:', err);
    } finally {
      server.close(() => {
        console.log('[Test] Server stopped.');
        mongoose.disconnect().then(() => {
          console.log('[Test] DB disconnected. Exiting.');
          process.exit(0);
        });
      });
    }
  });
}

runTests();
