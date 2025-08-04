// sdk/src/index.ts

import { IdentroClient } from './client';

// Main client
export { IdentroClient, createClient } from './client';

// Types
export type {
  // Core types
  Framework,
  Status,
  FailReason,
  AgentEvent,
  EventBatch,
  
  // Config types
  IdentroConfig,
  RecordEventOptions,
  
  // Response types
  BatchResult,
  ScoreResponse,
  
  // Utility types
  Logger,
  QueueStorage
} from './types';

// Constants for convenience
export const Frameworks = {
  LANGCHAIN: 'langchain',
  SUPERAGI: 'superagi',
  CREWAI: 'crewai',
  MCP: 'mcp',
  HTTP: 'http',
  CUSTOM: 'custom'
} as const;

export const FailReasons = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  FRAMEWORK_EXCEPTION: 'FRAMEWORK_EXCEPTION',
  POLICY_DENY: 'POLICY_DENY',
  TASK_UNFULFILLED: 'TASK_UNFULFILLED',
  COUNTERPARTY_SPAM: 'COUNTERPARTY_SPAM'
} as const;

// Version
export const VERSION = '0.1.0';

// Default export for convenience
export default IdentroClient;