# @identro/sdk

TypeScript SDK for Identro - AI Agent Credit Scoring System

[![npm version](https://img.shields.io/npm/v/@identro/sdk.svg)](https://www.npmjs.com/package/@identro/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Installation

```bash
# npm
npm install @identro/sdk

# yarn
yarn add @identro/sdk

# pnpm
pnpm add @identro/sdk

# bun
bun add @identro/sdk
```

## 📋 Quick Start

```typescript
import { createClient } from '@identro/sdk';

// Initialize the client
const identro = createClient({
  apiKey: 'your-api-key-here'
});

// Record a successful task
await identro.recordSuccess('task-123', 150);

// Record a failed task
await identro.recordFailure('task-456', 3000, 'NETWORK_ERROR');

// Get your agent's score
const score = await identro.getScore();
console.log(`Agent score: ${score.score} (${score.tier})`);
```

## 🔧 Configuration

```typescript
const identro = createClient({
  // Required
  apiKey: 'your-api-key',
  
  // Optional
  endpoint: 'https://api.identro.com',    // API endpoint
  agentId: 'my-agent-001',               // Default agent ID
  framework: 'langchain',                 // Default framework
  
  // Batching (for performance)
  batchSize: 100,                        // Events per batch
  flushInterval: 1000,                   // Ms between flushes
  
  // Reliability
  maxRetries: 3,                         // Retry attempts
  retryDelay: 1000,                      // Initial retry delay
  
  // Behavior
  throwOnError: false,                   // Throw or log errors
  debug: false                           // Enable debug logging
});
```

## 📊 Recording Events

### Simple Success/Failure

```typescript
// Record success with latency
await identro.recordSuccess('task-id', 142);

// Record failure with reason
await identro.recordFailure(
  'task-id', 
  3500, 
  'NETWORK_ERROR',
  'HTTP_504'
);
```

### Detailed Events

```typescript
await identro.recordEvent({
  task_id: 'complex-task-001',
  status: 'fail',
  latency_ms: 2500,
  fail_reason: 'TASK_UNFULFILLED',
  detail_code: 'GOAL_UNMET',
  metadata: {
    expected: 'json',
    received: 'text',
    model: 'gpt-4'
  }
});
```

### Failure Reasons

- `NETWORK_ERROR` - Network connectivity issues
- `CLIENT_ERROR` - Bad request, invalid parameters
- `FRAMEWORK_EXCEPTION` - Framework/runtime errors
- `POLICY_DENY` - Policy or permission denied
- `TASK_UNFULFILLED` - Task completed but goal not met
- `COUNTERPARTY_SPAM` - Flagged as spam by other agent

## 🔌 Framework Integration

### MCP (Model Context Protocol)

```typescript
import { createClient, Frameworks } from '@identro/sdk';

const identro = createClient({
  apiKey: 'your-key',
  framework: Frameworks.MCP
});

// Wrap your MCP handler
async function handleMCPRequest(request) {
  const start = Date.now();
  
  try {
    const result = await processMCPRequest(request);
    await identro.recordSuccess(
      `mcp-${request.id}`, 
      Date.now() - start
    );
    return result;
  } catch (error) {
    await identro.recordFailure(
      `mcp-${request.id}`,
      Date.now() - start,
      'FRAMEWORK_EXCEPTION'
    );
    throw error;
  }
}
```

### LangChain (Coming in Phase 7)

```typescript
import { IdentroCallbackHandler } from '@identro/sdk/langchain';

const chain = new LLMChain({
  llm: model,
  callbacks: [new IdentroCallbackHandler()]
});
```

## 🎯 Scoring System

Scores range from 300-850, similar to credit scores:

- **800-850**: Exceptional reliability
- **740-799**: Very good performance  
- **670-739**: Good performance
- **580-669**: Fair performance
- **300-579**: Poor performance

```typescript
const score = await identro.getScore();
// {
//   agent_id: "agent-123",
//   score: 742,
//   tier: "very_good",
//   total_events: 1523,
//   updated_at: "2024-01-20T10:30:00Z"
// }
```

## 🔄 Batching & Performance

The SDK automatically batches events for optimal performance:

- Events are queued locally and sent in batches
- Automatic retry with exponential backoff
- Graceful handling of network issues
- No blocking of your agent's execution

```typescript
// Force send all queued events
await identro.flush();

// Graceful shutdown
await identro.shutdown();
```

## 🛡️ Error Handling

By default, the SDK handles errors gracefully without interrupting your agent:

```typescript
// Silent error handling (default)
const identro = createClient({
  apiKey: 'key',
  throwOnError: false  // Logs errors, doesn't throw
});

// Strict error handling  
const identro = createClient({
  apiKey: 'key',
  throwOnError: true   // Throws on any error
});
```

## 🔍 Debugging

Enable debug mode to see detailed logs:

```typescript
const identro = createClient({
  apiKey: 'key',
  debug: true
});
```

## 📝 TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { 
  AgentEvent,
  ScoreResponse,
  FailReason,
  Framework 
} from '@identro/sdk';
```

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](https://github.com/identro/identro/blob/main/CONTRIBUTING.md).

## 📄 License

MIT © Identro Team

## 🔗 Links

- [Documentation](https://docs.identro.com)
- [API Reference](https://api.identro.com/docs)
- [Examples](https://github.com/identro-ai/identro-sdk-js/tree/main/examples)
- [Issues](https://github.com/identro-ai/identro-sdk-js/issues)
