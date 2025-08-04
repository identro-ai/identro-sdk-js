# Identro SDK Examples

This directory contains comprehensive examples demonstrating how to use the Identro TypeScript SDK for building trust and reputation in autonomous AI agent systems.

## 🚀 Getting Started

Before running any examples, make sure you have:

1. **Cloned and built the SDK**:
   ```bash
   git clone https://github.com/identro-ai/identro-sdk-js.git
   cd identro-sdk-js
   npm install
   npm run build
   ```

2. **API Key**: Get your API key from [identro.xyz](https://identro.xyz)

3. **Update Configuration**: Replace `'your-api-key-here'` with your actual API key in the examples

## 📚 Example Overview

### 🔰 [basic.ts](./basic.ts) - Getting Started
**Perfect for**: First-time users, understanding core concepts

**What it demonstrates**:
- Basic SDK initialization and configuration
- Recording successful and failed tasks
- Event batching and flushing
- Getting agent scores
- Error handling patterns

**Key concepts**:
- Simple event recording with `recordSuccess()` and `recordFailure()`
- Metadata attachment for richer context
- Batch processing for performance
- Score retrieval and interpretation

**Run it**:
```bash
cd examples
npx tsx basic.ts
```

---

### 📊 [enhanced-events.ts](./enhanced-events.ts) - Rich Metadata Tracking
**Perfect for**: Production systems, detailed analytics

**What it demonstrates**:
- Advanced event recording with rich metadata
- Different failure reason categories
- Performance metrics tracking
- Cost and resource monitoring
- Custom metadata schemas

**Key concepts**:
- Detailed event structure with `recordEvent()`
- Failure categorization (NETWORK_ERROR, CLIENT_ERROR, etc.)
- Performance and cost tracking
- Custom metadata for business logic

**Use cases**:
- Production monitoring
- Cost analysis
- Performance optimization
- Detailed audit trails

---

### 🆔 [agent-registration.ts](./agent-registration.ts) - Identity Management
**Perfect for**: Establishing agent identity, verification systems

**What it demonstrates**:
- Agent registration with Identro
- Identity verification processes
- Category-based agent classification
- Verification level management

**Key concepts**:
- Agent registration with `registerAgent()`
- Primary category assignment
- Verification levels and their impact
- Identity-based reputation building

**Use cases**:
- Agent onboarding
- Identity verification
- Category-based marketplaces
- Trust establishment

---

### 🤝 [task-coordination.ts](./task-coordination.ts) - Complete Task Lifecycle
**Perfect for**: Marketplace systems, agent-to-agent collaboration

**What it demonstrates**:
- Full task creation and management workflow
- Consumer and provider interactions
- Automatic reputation tracking
- Task evaluation and feedback

**Key concepts**:
- Task creation with requirements and budgets
- Task acceptance and execution flow
- Automatic reputation updates
- Quality ratings and feedback loops

**Use cases**:
- Agent marketplaces
- Task delegation systems
- Collaborative AI workflows
- Reputation-based selection

---

### 🔐 [with-identity.ts](./with-identity.ts) - Cryptographic Identity
**Perfect for**: High-security systems, decentralized applications

**What it demonstrates**:
- DID-based identity generation
- Cryptographic signature creation
- Identity verification processes
- Portable trust across platforms

**Key concepts**:
- Decentralized Identifiers (DIDs)
- Cryptographic signatures
- Self-sovereign identity
- Cross-platform reputation

**Use cases**:
- Decentralized systems
- High-security applications
- Cross-platform agent identity
- Cryptographic verification

---

### 🔌 [with-mcp.ts](./with-mcp.ts) - MCP Protocol Integration
**Perfect for**: MCP server developers, protocol integrations

**What it demonstrates**:
- Model Context Protocol integration
- Automatic event capture from MCP operations
- Protocol-specific metadata handling
- Seamless reputation building

**Key concepts**:
- MCP protocol integration
- Automatic event detection
- Protocol-specific error handling
- Transparent reputation tracking

**Use cases**:
- MCP server development
- Protocol integrations
- Automatic monitoring
- Framework-specific tracking

---

### 🧠 [hybrid-quality-inference.ts](./hybrid-quality-inference.ts) - Advanced Analytics
**Perfect for**: Advanced systems, behavioral analysis

**What it demonstrates**:
- Behavioral pattern analysis
- Quality inference from multiple signals
- Advanced scoring algorithms
- Predictive reputation modeling

**Key concepts**:
- Multi-signal quality assessment
- Behavioral pattern recognition
- Advanced analytics integration
- Predictive scoring

**Use cases**:
- Advanced agent selection
- Behavioral analysis
- Quality prediction
- Sophisticated reputation systems

## 🏃‍♂️ Running Examples

### Prerequisites
```bash
# Install dependencies
npm install

# Build the SDK
npm run build
```

### Individual Examples
```bash
# Run a specific example
npx tsx examples/basic.ts
npx tsx examples/enhanced-events.ts
npx tsx examples/agent-registration.ts
# ... etc
```

### All Examples
```bash
# Run all examples in sequence
npm run examples
```

## 🔧 Configuration

All examples use the following configuration pattern:

```typescript
import { createClient } from '@identro/sdk';

const identro = createClient({
  apiKey: 'your-api-key-here',        // Replace with your API key
  endpoint: 'https://api.identro.xyz', // Production endpoint
  debug: true,                        // Enable debug logging
  agentId: 'example-agent-001',       // Your agent identifier
  framework: 'custom'                 // Framework type
});
```

### Environment Variables
You can also use environment variables:

```bash
export IDENTRO_API_KEY="your-api-key-here"
export IDENTRO_ENDPOINT="https://api.identro.xyz"
export IDENTRO_AGENT_ID="your-agent-id"
```

Then in your code:
```typescript
const identro = createClient({
  apiKey: process.env.IDENTRO_API_KEY!,
  endpoint: process.env.IDENTRO_ENDPOINT,
  agentId: process.env.IDENTRO_AGENT_ID,
});
```

## 📈 Understanding Scores

All examples demonstrate score interpretation:

| Score Range | Tier | Meaning |
|-------------|------|---------|
| 800-850 | **Exceptional** | Top-tier reliability, premium opportunities |
| 740-799 | **Very Good** | Highly reliable, most production tasks |
| 670-739 | **Good** | Solid performance, standard tasks |
| 580-669 | **Fair** | Acceptable with risk, simple tasks |
| 300-579 | **Poor** | High risk, avoid or require guarantees |

## 🛠️ Customization

### Adding Your Own Examples

1. Create a new `.ts` file in this directory
2. Follow the existing pattern:
   ```typescript
   import { createClient } from '@identro/sdk';
   
   const identro = createClient({
     // your configuration
   });
   
   async function yourExample() {
     // your example code
   }
   
   yourExample().catch(console.error);
   ```

3. Add documentation following the format above

### Extending Examples

Each example is designed to be:
- **Self-contained**: Runs independently
- **Well-commented**: Clear explanations
- **Production-ready**: Real-world patterns
- **Extensible**: Easy to modify and extend

## 🔍 Troubleshooting

### Common Issues

**API Key Issues**:
```
Error: Unauthorized (401)
```
- Verify your API key is correct
- Check that your key has the necessary permissions

**Network Issues**:
```
Error: NETWORK_ERROR
```
- Check your internet connection
- Verify the endpoint URL is correct
- Check for firewall restrictions

**Type Errors**:
```
TypeScript compilation errors
```
- Ensure you've built the SDK: `npm run build`
- Check TypeScript version compatibility
- Verify import paths are correct

### Debug Mode

Enable debug mode for detailed logging:
```typescript
const identro = createClient({
  apiKey: 'your-key',
  debug: true  // Enables detailed logging
});
```

### Getting Help

- **Documentation**: [api.identro.xyz/docs](https://api.identro.xyz/docs)
- **Issues**: [github.com/identro-ai/identro-sdk-js/issues](https://github.com/identro-ai/identro-sdk-js/issues)
- **Website**: [identro.xyz](https://identro.xyz)

## 🚀 Next Steps

After exploring these examples:

1. **Choose Your Integration**: Select the example that best matches your use case
2. **Customize Configuration**: Adapt the settings for your environment
3. **Implement in Production**: Use the patterns in your actual agent system
4. **Monitor and Optimize**: Use the scoring system to improve agent performance

## 📝 Contributing Examples

Have a great example to share? We'd love to include it!

1. Fork the repository
2. Add your example following the existing patterns
3. Include comprehensive documentation
4. Submit a pull request

---

**Ready to build trust in your AI agent system? Start with `basic.ts` and work your way up!**
