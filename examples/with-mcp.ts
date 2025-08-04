// sdk/examples/with-mcp.ts

import { createClient, Frameworks, FailReasons } from '@identro/sdk';

// Simulated MCP types (replace with actual MCP imports)
interface MCPRequest {
  method: string;
  params?: any;
  id: string;
}

interface MCPResponse {
  result?: any;
  error?: { code: number; message: string };
  id: string;
}

// Initialize Identro
const identro = createClient({
  apiKey: process.env.IDENTRO_API_KEY || 'test-key',
  endpoint: 'http://localhost:3000', // Use local endpoint
  framework: Frameworks.MCP,
  debug: true
});

/**
 * MCP middleware that automatically tracks all MCP calls
 */
class IdentroMCPMiddleware {
  async handleRequest(request: MCPRequest, next: (req: MCPRequest) => Promise<MCPResponse>): Promise<MCPResponse> {
    const startTime = Date.now();
    const taskId = `mcp-${request.method}-${request.id}`;
    
    try {
      // Call the actual MCP handler
      const response = await next(request);
      
      // Record based on response
      if (response.error) {
        await identro.recordFailure(
          taskId,
          Date.now() - startTime,
          this.mapMCPErrorToFailReason(response.error.code),
          `MCP_${response.error.code}`,
          {
            method: request.method,
            error_message: response.error.message
          }
        );
      } else {
        await identro.recordSuccess(
          taskId,
          Date.now() - startTime,
          {
            method: request.method,
            has_result: !!response.result
          }
        );
      }
      
      return response;
    } catch (error) {
      // Network or framework error
      await identro.recordFailure(
        taskId,
        Date.now() - startTime,
        FailReasons.FRAMEWORK_EXCEPTION,
        'MCP_EXCEPTION',
        {
          method: request.method,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      );
      throw error;
    }
  }

  private mapMCPErrorToFailReason(code: number) {
    // MCP error codes to Identro fail reasons
    if (code >= -32099 && code <= -32000) return FailReasons.FRAMEWORK_EXCEPTION; // Server errors
    if (code === -32600) return FailReasons.CLIENT_ERROR; // Invalid request
    if (code === -32601) return FailReasons.CLIENT_ERROR; // Method not found
    if (code === -32602) return FailReasons.CLIENT_ERROR; // Invalid params
    if (code === -32603) return FailReasons.FRAMEWORK_EXCEPTION; // Internal error
    return FailReasons.FRAMEWORK_EXCEPTION;
  }
}

// Example usage
async function runMCPExample() {
  console.log('🔌 MCP + Identro Integration Example\n');

  const middleware = new IdentroMCPMiddleware();

  // Simulate MCP requests
  const mockMCPHandler = async (request: MCPRequest): Promise<MCPResponse> => {
    console.log(`Processing MCP request: ${request.method}`);
    
    // Simulate different scenarios
    if (request.method === 'tool.list') {
      return { result: ['tool1', 'tool2'], id: request.id };
    }
    
    if (request.method === 'tool.execute') {
      // Simulate 30% failure rate
      if (Math.random() < 0.3) {
        return {
          error: { code: -32603, message: 'Tool execution failed' },
          id: request.id
        };
      }
      return { result: { output: 'Success!' }, id: request.id };
    }
    
    // Method not found
    return {
      error: { code: -32601, message: `Method ${request.method} not found` },
      id: request.id
    };
  };

  // Process several MCP requests
  const requests: MCPRequest[] = [
    { method: 'tool.list', id: '1' },
    { method: 'tool.execute', params: { tool: 'calculator', input: '2+2' }, id: '2' },
    { method: 'tool.execute', params: { tool: 'search', query: 'weather' }, id: '3' },
    { method: 'unknown.method', id: '4' },
    { method: 'tool.execute', params: { tool: 'translator' }, id: '5' }
  ];

  for (const request of requests) {
    try {
      const response = await middleware.handleRequest(request, mockMCPHandler);
      console.log(`✅ Request ${request.id} completed:`, response.result ? 'Success' : 'Failed');
    } catch (error) {
      console.log(`❌ Request ${request.id} threw error:`, error);
    }
  }

  // Check score
  console.log('\n📊 Checking agent score...');
  await identro.flush();
  
  setTimeout(async () => {
    try {
      const score = await identro.getScore();
      console.log('\nAgent Performance:', {
        score: score.score,
        tier: score.tier,
        totalEvents: score.total_events
      });
    } catch (error) {
      console.error('Failed to get score:', error);
    }
    
    await identro.shutdown();
  }, 1500);
}

// Run example
runMCPExample().catch(console.error);
