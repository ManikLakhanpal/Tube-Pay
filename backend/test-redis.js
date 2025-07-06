const redis = require('redis');

// Test Redis connection and basic operations
async function testRedis() {
  console.log('🧪 Testing Redis Connection...\n');

  const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  try {
    // Connect to Redis
    await client.connect();
    console.log('✅ Connected to Redis successfully');

    // Test basic operations
    console.log('\n📝 Testing basic Redis operations...');

    // Set a test key
    await client.set('test:payment:123', JSON.stringify({
      id: '123',
      amount: 100,
      status: 'SUCCESS',
      timestamp: new Date().toISOString()
    }));
    console.log('✅ Set test payment data');

    // Get the test key
    const paymentData = await client.get('test:payment:123');
    console.log('✅ Retrieved payment data:', JSON.parse(paymentData));

    // Test expiration
    await client.setEx('test:expire', 5, 'This will expire in 5 seconds');
    console.log('✅ Set key with 5-second expiration');

    // Test increment
    await client.incr('test:counter');
    await client.incr('test:counter');
    const counter = await client.get('test:counter');
    console.log('✅ Counter value:', counter);

    // Test keys pattern
    const keys = await client.keys('test:*');
    console.log('✅ Found keys with pattern "test:*":', keys);

    // Clean up test data
    for (const key of keys) {
      await client.del(key);
    }
    console.log('✅ Cleaned up test data');

    // Test database size
    const dbSize = await client.dbSize();
    console.log('✅ Database size:', dbSize);

    console.log('\n🎉 All Redis tests passed!');
    console.log('\nYour Redis setup is working correctly.');
    console.log('You can now use the caching features in your payment system.');

  } catch (error) {
    console.error('❌ Redis test failed:', error.message);
    console.log('\n💡 Make sure Redis is running:');
    console.log('   - Install Redis: brew install redis (macOS)');
    console.log('   - Start Redis: redis-server');
    console.log('   - Check connection: redis-cli ping');
  } finally {
    await client.quit();
  }
}

// Run the test
testRedis(); 