// sdk/examples/with-identity.ts

import { createClient } from '@identro/sdk';
import { IdentityManager } from '@identro/sdk/identity';
import * as ed from '@noble/ed25519';
import { base58 } from '@scure/base';

/**
 * Example: Using Identro SDK with cryptographic identity
 */
async function runIdentityExample() {
  console.log('🔐 Identro SDK with Identity Example\n');

  // Step 1: Generate or load identity
  console.log('1️⃣ Setting up identity...');
  
  // Option A: Generate new identity
  const privateKey = ed.utils.randomPrivateKey();
  const publicKey = await ed.getPublicKey(privateKey);
  
  // Create DID from public key
  const multicodec = new Uint8Array([0xed, 0x01]);
  const multikey = new Uint8Array(multicodec.length + publicKey.length);
  multikey.set(multicodec);
  multikey.set(publicKey, multicodec.length);
  const did = `did:key:z${base58.encode(multikey)}`;
  
  console.log(`Generated DID: ${did.substring(0, 50)}...`);
  
  // Option B: Load from file (if exists)
  const identity = new IdentityManager({
    did,
    privateKey: Buffer.from(privateKey).toString('base64'),
    autoSign: true
  });
  
  // Alternative: Load from saved file
  // await identity.loadFromFile();
  
  // Step 2: Create Identro client
  console.log('\n2️⃣ Creating Identro client...');
  
  const client = createClient({
    apiKey: process.env.IDENTRO_API_KEY || 'demo-key',
    endpoint: 'http://localhost:3000',
    debug: true
  });
  
  // Step 3: Record events with signatures
  console.log('\n3️⃣ Recording signed events...');
  
  // Helper function to record signed events
  async function recordSignedEvent(
    taskId: string,
    status: 'success' | 'fail',
    latencyMs: number
  ) {
    // Generate event ID
    const eventId = crypto.randomUUID();
    const agentId = client.getAgentId();
    
    // Sign the event
    const signature = await identity.signEvent(eventId, agentId);
    
    // Record event with signature metadata
    await client.recordEvent({
      task_id: taskId,
      status,
      latency_ms: latencyMs,
      metadata: signature ? {
        signed: true,
        signature: signature.signature,
        signer_did: signature.did,
        signed_at: signature.timestamp
      } : undefined
    });
    
    console.log(`✅ Recorded ${status} event ${eventId.substring(0, 8)}... (signed: ${!!signature})`);
  }
  
  // Record some example events
  await recordSignedEvent('identity-task-1', 'success', 150);
  await recordSignedEvent('identity-task-2', 'success', 200);
  await recordSignedEvent('identity-task-3', 'fail', 3000);
  
  // Step 4: Create authenticated requests
  console.log('\n4️⃣ Making authenticated API calls...');
  
  // Create auth header for custom API calls
  const nonce = crypto.randomUUID();
  const authHeader = await identity.createAuthHeader(nonce);
  
  if (authHeader) {
    // Example: Register the DID with the API
    const response = await fetch('http://localhost:3000/v1/identity/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Identro-Key': client.getAgentId(),
        'Authorization': authHeader,
        'X-Nonce': nonce
      },
      body: JSON.stringify({
        agent_id: client.getAgentId(),
        did,
        signature: 'would-be-computed',
        nonce
      })
    });
    
    console.log(`Registration attempt: ${response.status}`);
  }
  
  // Step 5: Verify signatures
  console.log('\n5️⃣ Verifying signatures...');
  
  // Example of verifying a signature
  const testMessage = 'Hello Identro!';
  const msgBytes = new TextEncoder().encode(testMessage);
  const testSignature = await ed.sign(msgBytes, privateKey);
  const testSigBase58 = base58.encode(testSignature);
  
  // Verify locally
  const isValid = await ed.verify(testSignature, msgBytes, publicKey);
  console.log(`Local signature verification: ${isValid}`);
  
  // Verify via API
  const verifyResponse = await fetch('http://localhost:3000/v1/identity/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Identro-Key': 'demo'
    },
    body: JSON.stringify({
      message: testMessage,
      signature: testSigBase58,
      did
    })
  });
  
  const verifyResult = await verifyResponse.json();
  console.log(`API signature verification: ${verifyResult.valid}`);
  
  // Step 6: Get final score
  console.log('\n6️⃣ Checking agent score...');
  
  await client.flush();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const score = await client.getScore();
  console.log(`\nAgent Score: ${score.score} (${score.tier})`);
  console.log(`Total Events: ${score.total_events}`);
  console.log(`Agent DID: ${did.substring(0, 50)}...`);
  
  // Cleanup
  await client.shutdown();
  console.log('\n✅ Example complete!');
}

// Advanced: Custom client with built-in identity
class IdentroClientWithIdentity {
  private client: any;
  private identity: IdentityManager;
  
  constructor(config: any) {
    this.client = createClient(config);
    this.identity = new IdentityManager(config.identity);
  }
  
  async recordSignedSuccess(taskId: string, latencyMs: number) {
    const eventId = crypto.randomUUID();
    const signature = await this.identity.signEvent(eventId, this.client.getAgentId());
    
    await this.client.recordSuccess(taskId, latencyMs, {
      event_id: eventId,
      ...signature
    });
  }
  
  // ... other methods
}

// Run the example
if (require.main === module) {
  runIdentityExample().catch(console.error);
}

export { runIdentityExample, IdentroClientWithIdentity };
