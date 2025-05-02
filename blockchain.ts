import * as CryptoJS from 'crypto-js';

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: string;

    constructor(index: number, hash: string, previousHash: string, timestamp: number, data: string) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
    }
}

const calculateHash = (index: number, previousHash: string, timestamp: number, data: string): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

// Genesis block: is the first block in the blockchain. The only block that has no previousHash
const genesisBlock: Block = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', '', 1465154705, 'my genesis block!!'
);

const generateNewBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = new Date().getTime() / 1000;
    const newBlock: string = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return newBlock;
}

let blockchain: Block[] = [genesisBlock];

// Validating the integrity of blocks
// For a block to be valid following have to be true
// 1. Index of the block is one number greater than the previous
// 2. The 'previousHash' of the block match the 'hash' of the previous block
// 3. The hash of the block itself must be valid
const isValidNewBlock = (newBlock: Block, previousBlock: Block) {
    if(previousBlock.index + 1 !== newBlock.index) {
        console.log('Invalid index');
        return false;
    } else if(newBlock.previousHash !== previousBlock.hash) {
        console.log('Invalid previous hash');
        return false;
    } else if(calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
}

// We must also validate the block, so that malformed content sent by a peer won't crash our node
const isValidBlockStructure = (block: Block): boolean => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
}

// Validate a full chain of blocks
const isValidChain = (blockchainToValidate: Block[]): boolean => {
    // check if the first block in the chain matches with the genesis block
    const isValidGenesis = (block: Block): boolean => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if(!isValidGenesis(blockchainToValidate[0])) {
        return false;
    }

    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
}

// Choosing the longest chain
// There should always be only one explicit set of blocks in the chain at a given time. In case of conflicts (e.g. two nodes both generate 
// block number 72) we choose the chain that has the longest number of blocks. 
const replaceChain = (newBlocks: Block[]) => {
    if(isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
        console.log('Received blockchain is valid, replacing current blockchain with the new one.');
        blockchain = newBlocks;
        broadcastLatest();
    } else {
        console.log('Received blockchain is invalid.');
    }
}

// Communicating with other nodes
// An essential part of a node is to share and sync the blockchain with other nodes. The following rules are used to keep the network in sync.
// 1. When a node generates a new block, it broadcasts it to the network
// 2. When a node connects to a new peer it querys for the latest block
// 3. When a node encounters a block that has an index larger than the current known block, it either adds the block the its current chain or querys for the full blockchain.