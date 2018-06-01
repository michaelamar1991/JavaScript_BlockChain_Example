//////////////////////////////////////
// MiKoin - The first crypto potato //
//  BLOCKCHAIN BUILD EXAMPLE IN JS  //
//    using 'crypto-js' library     //
//          Michael Amar            //
//      mik.amar91@gmail.com        //
//////////////////////////////////////

const SHA256 = require('crypto-js/sha256');

class Transaction
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block
{
    constructor(timestamp, transactions, previousHash = "")
    {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash()
    {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty)
    {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))
        {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED : " + this.hash);
    }
}

class Blockchain
{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock()
    {
        return new Block("01/01/2018", "Genesis Block", "0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress)
    {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block succesfully mined!");
        this.chain.push(block);

        // Reward transaction for mining this block will be completed when the next block will be mined.
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address)
    {
        let balance = 0;
        for (const block of this.chain)
        {
            for(const trans of block.transactions)
            {
                if(trans.fromAddress == address)
                {
                    balance -= trans.amount;
                }

                if(trans.toAddress == address)
                {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid()
    {
        for(let i = 1 ; i < this.chain.length ; i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if (currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
        }
        return true;
    }
}

//Tests!

let MiKoin = new Blockchain();
MiKoin.createTransaction(new Transaction(null, 'address1', 150));
MiKoin.createTransaction(new Transaction('address1', 'address2', 100));
MiKoin.createTransaction(new Transaction('address2', 'address1', 40));

console.log('Starting the miner...');
MiKoin.minePendingTransactions('Miki_Address');

console.log('\nBalance of Miki is - ', MiKoin.getBalanceOfAddress('Miki_Address'));
console.log('\nBalance of address1 is - ', MiKoin.getBalanceOfAddress('address1'));
console.log('\nBalance of address2 is - ', MiKoin.getBalanceOfAddress('address2'));

console.log('Starting the miner...');
MiKoin.minePendingTransactions('Miki_Address');

console.log('\nBalance of Miki is - ', MiKoin.getBalanceOfAddress('Miki_Address'));
console.log('\nBalance of address1 is - ', MiKoin.getBalanceOfAddress('address1'));
console.log('\nBalance of address2 is - ', MiKoin.getBalanceOfAddress('address2'));

//console.log(JSON.stringify(MiKoin, null, 4));