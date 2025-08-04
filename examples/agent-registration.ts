// Example: Agent Registration with Primary Category
// Shows how to register an agent with a specific category for category-aware scoring

import { createClient } from '@identro/sdk';

async function demonstrateAgentRegistration() {
  console.log('🤖 Agent Registration with Primary Category Example\n');

  // Initialize client
  const client = createClient({
    endpoint: 'http://localhost:3000',
    apiKey: 'test-key-123'
  });

  try {
    // Step 1: Agent Registration Concept
    console.log('1️⃣ Agent Registration with Primary Category');
    
    const agentId = 'my-data-processing-agent';
    
    console.log(`   Agent ID: ${agentId}`);
    console.log('   Primary Category: data_processing');
    console.log();

    // Step 2: Registration API Call (conceptual)
    console.log('2️⃣ Registration API Call');
    
    console.log('   POST /v1/identity/register');
    console.log('   {');
    console.log('     "agent_id": "my-data-processing-agent",');
    console.log('     "did": "did:key:z6Mk...",');
    console.log('     "signature": "...",');
    console.log('     "nonce": "...",');
    console.log('     "primary_category": "data_processing"');
    console.log('   }');
    console.log();

    // Step 3: Record some events (category is automatically inherited)
    console.log('3️⃣ Recording Events (Category Automatically Applied)');
    
    // Events automatically get the agent's primary category
    await client.recordSuccess('data-task-1', 450);
    await client.recordSuccess('data-task-2', 380);
    
    console.log('   ✅ Recorded 2 successful data processing tasks');
    console.log('   📊 Events automatically tagged with "data_processing" category');
    console.log();

    // Step 4: Show how scoring works with categories
    console.log('4️⃣ Category-Aware Scoring Benefits');
    
    console.log('   When requestors get your score:');
    console.log('   • GET /v1/score/my-data-processing-agent');
    console.log('   • Uses agent\'s primary_category (data_processing)');
    console.log('   • Applies data processing scoring weights:');
    console.log('     - Technical Performance: 40% (vs 30% general)');
    console.log('     - Quality Metrics: 35% (vs 40% general)');
    console.log('     - Trust Factors: 25% (vs 30% general)');
    console.log();
    
    console.log('   Score optimized for data processing tasks:');
    console.log('   • Higher weight on execution time and throughput');
    console.log('   • Validation accuracy heavily weighted');
    console.log('   • Data integrity and consistency emphasized');
    console.log();

    // Step 5: Different categories for different agents
    console.log('5️⃣ Different Categories for Different Specializations');
    
    const categoryExamples = [
      {
        category: 'creative_generation',
        description: 'Content creation, art, writing',
        weights: 'Quality 50%, Technical 25%, Trust 25%',
        focus: 'Creativity, originality, user satisfaction'
      },
      {
        category: 'real_time_interaction',
        description: 'Chat, live support, real-time responses',
        weights: 'Technical 45%, Quality 30%, Trust 25%',
        focus: 'Response time, availability, consistency'
      },
      {
        category: 'financial_transactions',
        description: 'Payment processing, financial analysis',
        weights: 'Trust 50%, Technical 30%, Quality 20%',
        focus: 'Security, compliance, accuracy'
      }
    ];
    
    categoryExamples.forEach(example => {
      console.log(`   ${example.category}:`);
      console.log(`     Use case: ${example.description}`);
      console.log(`     Weights: ${example.weights}`);
      console.log(`     Focus: ${example.focus}`);
      console.log();
    });

    // Step 6: Best practices
    console.log('6️⃣ Best Practices');
    console.log('   ✅ Choose category that matches your agent\'s primary function');
    console.log('   ✅ Set category once during registration');
    console.log('   ✅ Events automatically inherit agent\'s category');
    console.log('   ✅ Requestors get category-optimized scores');
    console.log('   ✅ No need to specify category in every event');
    console.log();

    console.log('🎯 Registration Complete!');
    console.log('Your agent is now registered with category-aware scoring.');

  } catch (error) {
    console.error('❌ Registration failed:', error);
  }
}

// Run the example
demonstrateAgentRegistration()
  .then(() => {
    console.log('\n✨ Example completed successfully!');
  })
  .catch((error) => {
    console.error('\n💥 Example failed:', error);
  });

export { demonstrateAgentRegistration };
