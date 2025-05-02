# Simple Blockchain Implementation

This is a simple implementation of a blockchain with peer-to-peer networking capabilities. It demonstrates the core concepts of blockchain technology in a straightforward manner.

## What is a Blockchain?

A blockchain is a distributed, decentralized digital ledger that records transactions across many computers. Here's how it works in simple terms:

1. **Blocks**: Think of a block as a page in a ledger. Each block contains:
   - A list of transactions (in our case, just a single data string)
   - A timestamp
   - A reference to the previous block (like a page number)
   - A unique fingerprint (hash) of its contents

2. **Chain**: Blocks are linked together in chronological order, forming a chain. Each block contains the hash of the previous block, creating an unbreakable link.

3. **Decentralization**: Instead of one central authority, multiple computers (nodes) maintain copies of the blockchain. They communicate and agree on which transactions are valid.

4. **Security**: The hash of each block depends on its contents and the previous block's hash. If someone tries to change a block, they would need to change all subsequent blocks, which is computationally impossible.

## How This Implementation Works

### 1. Block Structure
```typescript
class Block {
    public index: number;        // Position in the chain
    public hash: string;         // Unique fingerprint
    public previousHash: string; // Link to previous block
    public timestamp: number;    // When the block was created
    public data: string;         // The actual content
}
```

### 2. Creating New Blocks
When you want to add new data to the blockchain:
1. The system takes the latest block
2. Creates a new block with:
   - Next index number
   - Current timestamp
   - Your data
   - Hash of the previous block
3. Calculates a new hash for this block
4. Adds it to the chain

### 3. Peer-to-Peer Network
The system uses WebSocket connections to:
- Share new blocks with other nodes
- Keep all nodes in sync
- Allow new nodes to join the network

## API Endpoints

1. **View Blockchain**
   ```bash
   curl http://localhost:3001/blocks
   ```
   Shows all blocks in the chain.

2. **Mine New Block**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"data": "Your data here"}' http://localhost:3001/mineBlock
   ```
   Creates a new block with your data.

3. **View Connected Peers**
   ```bash
   curl http://localhost:3001/peers
   ```
   Shows all connected nodes.

4. **Add New Peer**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"peer": "ws://localhost:6002"}' http://localhost:3001/addPeer
   ```
   Connects to another node.

## Setting Up the Project

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the First Node**
   ```bash
   npm start
   ```
   This starts a node on:
   - HTTP port 3001 (for API)
   - WebSocket port 6001 (for P2P)

3. **Start Additional Nodes** (optional)
   Open a new terminal and run:
   ```bash
   HTTP_PORT=3002 P2P_PORT=6002 npm start
   ```
   This starts a second node on different ports.

4. **Connect Nodes** (if running multiple)
   ```bash
   # From first node to second
   curl -X POST -H "Content-Type: application/json" -d '{"peer": "ws://localhost:6002"}' http://localhost:3001/addPeer
   
   # From second node to first
   curl -X POST -H "Content-Type: application/json" -d '{"peer": "ws://localhost:6001"}' http://localhost:3002/addPeer
   ```

## Testing the Blockchain

1. **Check Initial Blockchain**
   ```bash
   curl http://localhost:3001/blocks
   ```
   You should see the genesis block.

2. **Add Some Data**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"data": "Hello Blockchain!"}' http://localhost:3001/mineBlock
   ```

3. **Verify the New Block**
   ```bash
   curl http://localhost:3001/blocks
   ```
   You should now see two blocks.

4. **If Running Multiple Nodes**
   - Add data to one node
   - Check the other node
   - You should see the same data (after a short delay)

## Why This is a Good Implementation

1. **Core Blockchain Features**
   - Blocks with hashes
   - Chain linking
   - Data immutability
   - Timestamping

2. **Network Features**
   - Peer discovery
   - Block propagation
   - Chain synchronization

3. **Security**
   - Hash-based block linking
   - Block validation
   - Chain validation

4. **Simplicity**
   - Clear, readable code
   - Well-structured components
   - Easy to understand and extend

## Next Steps

This implementation can be extended with:
1. More complex transactions
2. Proof of Work
3. Wallet functionality
4. Smart contracts
5. More robust peer discovery

Feel free to explore and enhance this implementation! 