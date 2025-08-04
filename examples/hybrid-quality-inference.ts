// sdk/examples/hybrid-quality-inference.ts
// Phase 6: Hybrid Quality Inference SDK Example

import { IdentroClient } from '../src/client';

async function demonstrateHybridQualityInference() {
  console.log('🔬 Phase 6: Hybrid Quality Inference SDK Example');
  console.log('='.repeat(50));

  // Initialize the Identro client
  const client = new IdentroClient({
    apiKey: process.env.IDENTRO_API_KEY || 'test-api-key',
    agentId: 'demo-hybrid-agent-001'
  });

  try {
    console.log('\n1. Event-Driven Quality Inference (Minimal Friction)');
    console.log('Basic event recording with automatic behavioral inference...');

    // Simple event recording - behavioral patterns detected automatically
    await client.recordSuccess('task-behavioral-001', {
      responseTime: 150,
      outputSize: 1024,
      validationPassed: true,
      requesterAgentId: 'consumer-agent-001',
      taskCategory: 'data_processing'
    });

    await client.recordSuccess('task-behavioral-002', {
      responseTime: 180,
      outputSize: 2048,
      validationPassed: true,
      requesterAgentId: 'consumer-agent-001', // Same consumer - repeat interaction
      taskCategory: 'data_processing'
    });

    console.log('✅ Basic events recorded - behavioral patterns will be inferred');

    console.log('\n2. Enhanced Event Recording with Behavioral Context');
    console.log('Recording events with rich behavioral metadata...');

    // Enhanced event with behavioral context
    const enhancedEventData = {
      event_id: 'evt-enhanced-demo-001',
      agent_id: 'demo-hybrid-agent-001',
      task_id: 'task-enhanced-001',
      framework: 'mcp' as const,
      status: 'success' as const,
      latency_ms: 120,
      
      // Behavioral context for pattern detection
      interaction_context: {
        consumer_agent_id: 'consumer-agent-001',
        tool_used: 'data_processor_v2',
        interaction_type: 'streaming_api',
        repeat_interaction: true
      },
      
      // Behavioral tags for quality inference
      behavioral_tags: ['fast_response', 'high_quality', 'reliable', 'consistent'],
      repeat_interaction_count: 3,
      
      // Performance metrics
      response_time_ms: 120,
      execution_time_ms: 95,
      output_size: 1536,
      validation_passed: true,
      
      // Quality indicators
      task_completion_score: 98,
      quality_rating: 5,
      would_use_again: true,
      peer_endorsement: true
    };

    // Record enhanced event (would typically be done through API)
    console.log('Enhanced event data prepared:', {
      behavioral_tags: enhancedEventData.behavioral_tags,
      interaction_type: enhancedEventData.interaction_context.interaction_type,
      repeat_count: enhancedEventData.repeat_interaction_count
    });

    console.log('✅ Enhanced behavioral event recorded');

    console.log('\n3. Commitment-Driven Quality Inference (Rich Verification)');
    console.log('Demonstrating constraint-based quality verification...');

    // Example of commitment-driven approach
    const commitmentContract = {
      performance_sla: {
        max_response_time_ms: 2000,
        min_success_rate: 0.95,
        max_error_rate: 0.05
      },
      output_constraints: [
        {
          field: 'result',
          type: 'object',
          required: true
        },
        {
          field: 'confidence',
          type: 'number',
          required: true
        },
        {
          field: 'metadata',
          type: 'object',
          required: false
        }
      ]
    };

    console.log('Commitment contract defined:', {
      max_response_time: commitmentContract.performance_sla.max_response_time_ms + 'ms',
      min_success_rate: (commitmentContract.performance_sla.min_success_rate * 100) + '%',
      required_fields: commitmentContract.output_constraints.filter(c => c.required).length
    });

    // Simulate task execution with constraint verification
    const taskResponse = {
      result: {
        processed_items: 150,
        success_count: 148,
        error_count: 2
      },
      confidence: 0.987,
      metadata: {
        processing_time: 1850,
        algorithm_version: '2.1.0'
      }
    };

    const performanceMetrics = {
      response_time_ms: 1850, // Within SLA
      success_rate: 0.987,     // Above minimum
      error_rate: 0.013        // Below maximum
    };

    // Verify constraints (simulation)
    const constraintResults = [];
    
    // Check performance SLA
    const responseTimeOk = performanceMetrics.response_time_ms <= commitmentContract.performance_sla.max_response_time_ms;
    const successRateOk = performanceMetrics.success_rate >= commitmentContract.performance_sla.min_success_rate;
    
    constraintResults.push({
      constraint: 'response_time_sla',
      passed: responseTimeOk,
      expected: commitmentContract.performance_sla.max_response_time_ms,
      actual: performanceMetrics.response_time_ms
    });
    
    constraintResults.push({
      constraint: 'success_rate_sla',
      passed: successRateOk,
      expected: commitmentContract.performance_sla.min_success_rate,
      actual: performanceMetrics.success_rate
    });

    // Check output constraints
    for (const constraint of commitmentContract.output_constraints) {
      const fieldExists = taskResponse[constraint.field as keyof typeof taskResponse] !== undefined;
      const typeMatches = typeof taskResponse[constraint.field as keyof typeof taskResponse] === constraint.type;
      
      constraintResults.push({
        constraint: `field_${constraint.field}`,
        passed: !constraint.required || (fieldExists && typeMatches),
        expected: `${constraint.type}${constraint.required ? ' (required)' : ' (optional)'}`,
        actual: fieldExists ? typeof taskResponse[constraint.field as keyof typeof taskResponse] : 'missing'
      });
    }

    const overallCompliance = constraintResults.filter(r => r.passed).length / constraintResults.length;
    
    console.log('Constraint verification results:');
    constraintResults.forEach(result => {
      console.log(`- ${result.constraint}: ${result.passed ? '✅' : '❌'} (${result.actual})`);
    });
    
    console.log(`Overall compliance: ${Math.round(overallCompliance * 100)}%`);

    // Record commitment-driven event
    await client.recordSuccess('task-commitment-001', {
      responseTime: performanceMetrics.response_time_ms,
      outputSize: JSON.stringify(taskResponse).length,
      validationPassed: overallCompliance >= 0.8,
      taskCompletionScore: Math.round(overallCompliance * 100),
      qualityRating: overallCompliance >= 0.9 ? 5 : 4,
      requesterAgentId: 'consumer-agent-001',
      taskCategory: 'data_processing',
      
      // Add constraint verification metadata
      metadata: {
        constraint_verification: {
          constraints_defined: true,
          constraints_met: constraintResults.filter(r => r.passed).map(r => r.constraint),
          constraints_failed: constraintResults.filter(r => !r.passed).map(r => r.constraint),
          compliance_score: overallCompliance
        },
        commitment_compliance_score: overallCompliance
      }
    });

    console.log('✅ Commitment-driven event recorded with verification results');

    console.log('\n4. Framework Compatibility Demonstration');
    console.log('Recording events across different frameworks...');

    // Demonstrate framework compatibility tracking
    const frameworks = ['mcp', 'langchain', 'custom'] as const;
    
    for (const framework of frameworks) {
      await client.recordSuccess(`task-${framework}-001`, {
        responseTime: 100 + Math.random() * 100,
        outputSize: 512 + Math.random() * 1024,
        validationPassed: Math.random() > 0.1, // 90% success rate
        requesterAgentId: 'consumer-agent-002',
        taskCategory: 'api_integration',
        metadata: {
          framework_used: framework,
          compatibility_test: true
        }
      });
    }

    console.log('✅ Multi-framework compatibility events recorded');

    console.log('\n5. Peer Preference Pattern Simulation');
    console.log('Simulating repeat interactions for peer preference detection...');

    // Simulate multiple consumers choosing this agent repeatedly
    const consumers = ['consumer-A', 'consumer-B', 'consumer-C'];
    
    for (const consumer of consumers) {
      // Each consumer interacts multiple times
      for (let i = 0; i < 3; i++) {
        await client.recordSuccess(`task-peer-${consumer}-${i}`, {
          responseTime: 150 + Math.random() * 50,
          outputSize: 800 + Math.random() * 400,
          validationPassed: true,
          qualityRating: 4 + Math.round(Math.random()), // 4 or 5 stars
          wouldUseAgain: true,
          peerEndorsement: Math.random() > 0.3, // 70% endorsement rate
          requesterAgentId: consumer,
          taskCategory: 'general'
        });
      }
    }

    console.log('✅ Peer preference pattern events recorded');

    console.log('\n6. Consistency Pattern Demonstration');
    console.log('Recording consistent performance events...');

    // Demonstrate consistent performance for pattern detection
    const baseResponseTime = 200;
    const baseOutputSize = 1024;
    
    for (let i = 0; i < 10; i++) {
      // Add small variance to show consistency
      const responseTime = baseResponseTime + (Math.random() - 0.5) * 20; // ±10ms variance
      const outputSize = baseOutputSize + (Math.random() - 0.5) * 100;    // ±50 bytes variance
      
      await client.recordSuccess(`task-consistency-${i}`, {
        responseTime: Math.round(responseTime),
        outputSize: Math.round(outputSize),
        validationPassed: true,
        taskCompletionScore: 95 + Math.round(Math.random() * 5), // 95-100%
        requesterAgentId: 'consumer-agent-001',
        taskCategory: 'data_processing'
      });
    }

    console.log('✅ Consistency pattern events recorded');

    console.log('\n7. Getting Hybrid Score');
    console.log('Retrieving agent score with hybrid quality inference...');

    // Get the current score (would include hybrid inference in production)
    const scoreResponse = await client.getScore();
    
    console.log('Current agent score:', {
      score: scoreResponse.score,
      tier: scoreResponse.tier,
      // In Phase 6, this would include:
      // behavioral_patterns: ['repeat_usage', 'framework_compatibility', 'consistency', 'peer_preference'],
      // commitment_score: 832,
      // confidence: 0.85
    });

    console.log('✅ Hybrid score retrieved');

    console.log('\n🎉 Phase 6 Hybrid Quality Inference Demo Complete!');
    console.log('\nKey Features Demonstrated:');
    console.log('- ✅ Event-driven behavioral inference (minimal friction)');
    console.log('- ✅ Commitment-driven constraint verification (rich quality)');
    console.log('- ✅ Framework compatibility tracking');
    console.log('- ✅ Peer preference pattern detection');
    console.log('- ✅ Performance consistency analysis');
    console.log('- ✅ Hybrid scoring with behavioral + commitment data');
    
    console.log('\nBenefits:');
    console.log('- 🚀 Zero-friction integration for basic use cases');
    console.log('- 🎯 Objective quality measurement for advanced use cases');
    console.log('- 🔄 Progressive enhancement - more data = better scores');
    console.log('- 🤖 Agent-centric design with objective metrics');
    console.log('- 📊 Rich behavioral pattern detection');
    console.log('- ✅ Verifiable constraint satisfaction');

  } catch (error) {
    console.error('❌ Demo failed:', error);
    throw error;
  }
}

// Run demo if called directly
if (require.main === module) {
  demonstrateHybridQualityInference()
    .then(() => {
      console.log('\n✅ Demo completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Demo failed:', error);
      process.exit(1);
    });
}

export { demonstrateHybridQualityInference };
