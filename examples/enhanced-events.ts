// sdk/examples/enhanced-events.ts - Phase 5.1 Enhanced Event Recording Example

import { IdentroClient } from '../src/client';
import { TaskCategory, TaskComplexity } from '../src/types';

// Initialize the client
const client = new IdentroClient({
  apiKey: 'your-api-key',
  endpoint: 'http://localhost:3000',
  agentId: 'my-ai-agent',
  framework: 'langchain'
});

async function demonstrateEnhancedEventRecording() {
  console.log('🚀 Demonstrating Phase 5.1 Enhanced Event Recording');
  console.log('====================================================');

  // Example 1: Data Processing Task with Performance Metrics
  console.log('\n1. Recording data processing task with performance metrics...');
  
  const startTime = Date.now();
  
  // Simulate some work
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  await client.recordSuccess({
    task_id: 'data-processing-001',
    status: 'success',
    latency_ms: totalTime,
    
    // Enhanced performance metrics
    responseTime: totalTime,
    queueTime: 50,
    executionTime: totalTime - 50,
    
    // Quality indicators
    outputSize: 4096,
    validationPassed: true,
    requirementsMet: ['accuracy', 'completeness', 'format'],
    taskCompletionScore: 95,
    
    // Task context
    taskCategory: 'data_processing' as TaskCategory,
    taskComplexity: 'moderate' as TaskComplexity,
    
    // Quality feedback
    qualityRating: 5
  });
  
  console.log('✅ Data processing event recorded with enhanced metrics');

  // Example 2: Creative Generation with Bidirectional Scoring
  console.log('\n2. Recording creative task with bidirectional scoring...');
  
  await client.recordSuccess({
    task_id: 'creative-generation-001',
    status: 'success',
    latency_ms: 3500,
    
    // Performance metrics
    responseTime: 3500,
    executionTime: 3200,
    
    // Quality indicators
    outputSize: 1024,
    validationPassed: true,
    taskCompletionScore: 88,
    
    // Bidirectional context
    requesterAgentId: 'content-requester-001',
    taskCategory: 'creative_generation' as TaskCategory,
    taskComplexity: 'complex' as TaskComplexity,
    
    // Feedback from both sides
    qualityRating: 4,
    wouldUseAgain: true,
    peerEndorsement: true,
    
    // Consumer metrics
    taskClarityScore: 85,
    paymentConfirmed: true,
    responseTimeToProvider: 200
  });
  
  console.log('✅ Creative generation event recorded with bidirectional data');

  // Example 3: Real-time Interaction (Chat/Support)
  console.log('\n3. Recording real-time interaction...');
  
  await client.recordSuccess({
    task_id: 'chat-support-001',
    status: 'success',
    latency_ms: 800,
    
    // Performance metrics (speed is critical for real-time)
    responseTime: 800,
    queueTime: 100,
    executionTime: 700,
    p50Latency: 750,
    p95Latency: 950,
    
    // Quality indicators
    taskCompletionScore: 92,
    
    // Task context
    taskCategory: 'real_time_interaction' as TaskCategory,
    taskComplexity: 'simple' as TaskComplexity,
    
    // Feedback
    qualityRating: 5,
    wouldUseAgain: true
  });
  
  console.log('✅ Real-time interaction event recorded');

  // Example 4: API Integration with Error Handling
  console.log('\n4. Recording API integration failure...');
  
  await client.recordFailure('NETWORK_ERROR', {
    task_id: 'api-integration-001',
    status: 'fail',
    latency_ms: 10000,
    
    // Performance metrics (showing timeout)
    responseTime: 10000,
    executionTime: 9800,
    
    // Task context
    taskCategory: 'api_integration' as TaskCategory,
    taskComplexity: 'moderate' as TaskComplexity,
    
    // Quality feedback (even for failures)
    qualityRating: 1,
    wouldUseAgain: false,
    
    // Additional context
    metadata: {
      endpoint: 'https://api.example.com/data',
      timeout_threshold: 5000,
      retry_attempts: 3
    }
  });
  
  console.log('✅ API integration failure recorded with context');

  // Example 5: Financial Transaction (High Trust Requirements)
  console.log('\n5. Recording financial transaction...');
  
  await client.recordSuccess({
    task_id: 'financial-tx-001',
    status: 'success',
    latency_ms: 2500,
    
    // Performance metrics
    responseTime: 2500,
    executionTime: 2200,
    
    // Quality indicators (critical for financial)
    validationPassed: true,
    requirementsMet: ['compliance', 'accuracy', 'audit_trail'],
    taskCompletionScore: 100,
    
    // Task context
    taskCategory: 'financial_transactions' as TaskCategory,
    taskComplexity: 'complex' as TaskComplexity,
    
    // High trust feedback
    qualityRating: 5,
    wouldUseAgain: true,
    peerEndorsement: true,
    
    // Consumer confirmation
    paymentConfirmed: true,
    taskClarityScore: 95
  });
  
  console.log('✅ Financial transaction event recorded');

  // Flush any remaining events
  await client.flush();
  
  console.log('\n🎉 Enhanced Event Recording Demo Complete!');
  console.log('==========================================');
  console.log('✅ Performance metrics captured');
  console.log('✅ Quality indicators tracked');
  console.log('✅ Bidirectional scoring data recorded');
  console.log('✅ Task categorization applied');
  console.log('✅ Complexity levels specified');
  console.log('✅ Rich feedback collected');
  console.log('\n📊 Events are now ready for multi-dimensional scoring!');
}

// Run the demonstration
demonstrateEnhancedEventRecording().catch(console.error);
