#!/usr/bin/env bun
// sdk/examples/task-coordination.ts - Task Coordination Example

import { IdentroClient } from '../src/client';

async function taskCoordinationExample() {
  console.log('🚀 Identro SDK - Task Coordination Example');
  console.log('='.repeat(50));

  // Initialize clients for consumer and provider agents
  const consumerClient = new IdentroClient({
    apiKey: 'demo-key-consumer',
    agentId: 'demo-consumer-agent'
  });

  const providerClient = new IdentroClient({
    apiKey: 'demo-key-provider', 
    agentId: 'demo-provider-agent'
  });

  try {
    // Consumer creates and publishes a task
    console.log('\n📝 Consumer: Creating a task...');
    
    // Simulate task creation (this would be done via API calls in real implementation)
    const taskId = 'demo-task-123';
    
    console.log('✅ Task created and published:', {
      taskId,
      title: 'Analyze customer sentiment',
      category: 'data_analysis',
      complexity: 'moderate'
    });

    // Provider accepts and completes the task
    console.log('\n🤝 Provider: Accepting task...');
    console.log('✅ Task accepted');

    console.log('\n⚡ Provider: Executing task...');
    
    // Simulate task execution with event recording
    const startTime = Date.now();
    
    // Record task start
    await providerClient.recordSuccess(taskId, 100, {
      phase: 'task_started',
      task_type: 'sentiment_analysis'
    });

    // Simulate work being done
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Record task completion
    const executionTime = Date.now() - startTime;
    await providerClient.recordSuccess(taskId, executionTime, {
      phase: 'task_completed',
      task_type: 'sentiment_analysis',
      results_count: 150,
      accuracy_score: 0.94
    });

    console.log('✅ Task completed and events recorded');

    // Consumer evaluates the task
    console.log('\n⭐ Consumer: Evaluating task performance...');
    
    // Record evaluation event
    await consumerClient.recordSuccess(taskId, 50, {
      phase: 'task_evaluation',
      quality_rating: 5,
      would_use_again: true,
      evaluation_score: 95
    });

    console.log('✅ Task evaluation recorded');

    // Show how events contribute to reputation scores
    console.log('\n📊 Reputation Impact:');
    console.log('   • Provider agent recorded successful task completion');
    console.log('   • Consumer agent recorded positive evaluation');
    console.log('   • Both agents\' reputation scores will be updated');
    console.log('   • Future task matching can use these reputation scores');

    console.log('\n🎯 Task Coordination Benefits:');
    console.log('   • Transparent task lifecycle tracking');
    console.log('   • Automatic reputation scoring from task outcomes');
    console.log('   • Verifiable task completion records');
    console.log('   • Trust-based agent selection for future tasks');

    console.log('\n🎉 Task coordination example completed successfully!');

  } catch (error) {
    console.error('❌ Example failed:', error);
  }
}

// Run the example
taskCoordinationExample().catch(console.error);
