// sdk/src/identity.ts - Identity support for SDK

import * as ed from '@noble/ed25519';
import { base58 } from '@scure/base';

// Configure SHA-512 for ed25519
try {
  // Try Node.js crypto first
  const crypto = require('crypto');
  ed.etc.sha512Sync = (...messages) => {
    const hash = crypto.createHash('sha512');
    messages.forEach(msg => hash.update(msg));
    return new Uint8Array(hash.digest());
  };
} catch (e) {
  // Browser environment or no Node.js crypto
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    // Use Web Crypto API
    ed.etc.sha512Async = async (...messages) => {
      const data = messages.reduce((acc, msg) => {
        const arr = new Uint8Array(acc.length + msg.length);
        arr.set(acc);
        arr.set(msg, acc.length);
        return arr;
      }, new Uint8Array());
      
      const hash = await globalThis.crypto.subtle.digest('SHA-512', data);
      return new Uint8Array(hash);
    };
    
    // Provide a sync fallback that throws
    ed.etc.sha512Sync = (...m) => {
      throw new Error('Sync SHA-512 not available in browser, use async methods');
    };
  } else {
    console.warn('No SHA-512 implementation available');
  }
}

export interface IdentityConfig {
  did?: string;
  privateKey?: string; // Base64 encoded
  autoSign?: boolean;
}

export interface SignedEvent {
  signature: string;
  did: string;
  timestamp: number;
}

export class IdentityManager {
  private did?: string;
  private privateKey?: Uint8Array;
  private autoSign: boolean;

  constructor(config: IdentityConfig = {}) {
    this.did = config.did;
    this.autoSign = config.autoSign || false;
    
    if (config.privateKey) {
      this.privateKey = new Uint8Array(
        Buffer.from(config.privateKey, 'base64')
      );
    }
  }

  /**
   * Set identity credentials
   */
  setIdentity(did: string, privateKey: string) {
    this.did = did;
    this.privateKey = new Uint8Array(
      Buffer.from(privateKey, 'base64')
    );
  }

  /**
   * Check if identity is configured
   */
  hasIdentity(): boolean {
    return !!(this.did && this.privateKey);
  }

  /**
   * Sign an event
   */
  async signEvent(eventId: string, agentId: string): Promise<SignedEvent | null> {
    if (!this.hasIdentity() || !this.autoSign) {
      return null;
    }

    const timestamp = Date.now();
    const message = `${eventId}:${agentId}:${timestamp}`;
    
    const msgBytes = new TextEncoder().encode(message);
    const signature = await ed.sign(msgBytes, this.privateKey!);
    
    return {
      signature: base58.encode(signature),
      did: this.did!,
      timestamp
    };
  }

  /**
   * Create authentication header
   */
  async createAuthHeader(nonce: string): Promise<string | null> {
    if (!this.hasIdentity()) {
      return null;
    }

    const message = `${this.did}:${nonce}:${Date.now()}`;
    const msgBytes = new TextEncoder().encode(message);
    const signature = await ed.sign(msgBytes, this.privateKey!);
    
    // Create JWT-like token
    const token = {
      did: this.did,
      nonce,
      timestamp: Date.now(),
      signature: base58.encode(signature)
    };

    return `DID ${Buffer.from(JSON.stringify(token)).toString('base64')}`;
  }

  /**
   * Load identity from file (Node.js only)
   */
  async loadFromFile(path?: string): Promise<boolean> {
    try {
      // Default to ~/.identro/identity.json
      const configPath = path || `${process.env.HOME}/.identro/identity.json`;
      
      if (typeof window !== 'undefined') {
        console.warn('File loading not available in browser');
        return false;
      }

      const fs = await import('fs/promises');
      const data = await fs.readFile(configPath, 'utf-8');
      const identity = JSON.parse(data);

      this.did = identity.did;
      this.privateKey = new Uint8Array(
        Buffer.from(identity.private_key, 'base64')
      );

      return true;
    } catch (error) {
      return false;
    }
  }
}

// Update the SDK client configuration
export interface IdentroConfigWithIdentity {
  apiKey: string;
  endpoint?: string;
  identity?: IdentityConfig;
  // ... other existing config
}

// Extension for signed events
export interface SignedAgentEvent {
  event_id: string;
  agent_id: string;
  task_id: string;
  framework: string;
  status: 'success' | 'fail';
  latency_ms: number;
  timestamp?: string;
  
  // Signature fields
  signature?: string;
  signer_did?: string;
  signed_at?: number;
}
