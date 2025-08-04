// sdk/examples/basic.ts

import { createClient, FailReasons } from '@identro/sdk';

// Initialize the client
const identro = createClient({
  apiKey: 'your-api-key-here',
  endpoint: 'https://api.identro.xyz', // Use production URL in real usage
  debug: true, // Enable debug logging
  agentId: 'example-agent-001',
  framework: 'custom'
});

async function runExamples() {
  console.log('🚀 Running Identro SDK examples...\n');

  // Example 1: Record a successful task
  console.log('📝 Recording successful task...');
  await identro.recordSuccess('task-001', 142, {
    model: 'gpt-4',
    prompt_tokens: 150,
    completion_tokens: 80
  });

  // Example 2: Record a failed task
  console.log('❌ Recording failed task...');
  await identro.recordFailure(
    'task-002',
    3500,
    FailReasons.NETWORK_ERROR,
    'HTTP_504',
    { retry_count: 3 }
  );

  // Example 3: Record with full options
  console.log('📊 Recording with full options...');
  await identro.recordEvent({
    task_id: 'task-003',
    status: 'fail',
    latency_ms: 250,
    fail_reason: FailReasons.TASK_UNFULFILLED,
    detail_code: 'GOAL_UNMET',
    policy_violation: false,
    metadata: {
      expected_output: 'json',
      actual_output: 'text',
      validation_errors: ['Invalid format']
    }
  });

  // Example 4: Batch multiple events quickly
  console.log('🔄 Recording multiple events...');
  const promises: Promise<void>[] = [];
  for (let i = 0; i < 10; i++) {
    const isSuccess = Math.random() > 0.3;
    promises.push(
      isSuccess
        ? identro.recordSuccess(`batch-task-${i}`, Math.floor(Math.random() * 1000))
        : identro.recordFailure(`batch-task-${i}`, Math.floor(Math.random() * 5000))
    );
  }
  await Promise.all(promises);

  // Force flush to send immediately
  console.log('💾 Flushing events...');
  await identro.flush();

  // Example 5: Get agent score
  console.log('📈 Getting agent score...');
  try {
    const score = await identro.getScore();
    console.log('Agent Score:', {
      score: score.score,
      tier: score.tier,
      totalEvents: score.total_events
    });
  } catch (error) {
    console.error('Failed to get score:', error);
  }

  // Cleanup
  console.log('\n✅ Examples complete! Shutting down...');
  await identro.shutdown();
}

// Run examples
runExamples().catch(console.error);
