# pow_blockchain

**Decentralized Proof of Work Blockchain**, similar to the Bitcoin blockchain, coded in JavaScript.<br />
Blockchain built along with **Eric Traub**, instructor of the course [Learn Blockchain By Building Your Own In JavaScript](https://www.udemy.com/build-a-blockchain-in-javascript/learn/v4/overview) hosted on Udemy.

## Blockchain features:

- **Proof of work algorithm** to secure the network.
- **Hashing algorithms** (SHA256) to secure the data within the blockchain.
- Ability to **mine** (create) **new blocks** that contain data.
- Ability to **create transactions** and **store** them **in blocks**.
- **API/server** to interact with the blockchain from the internet.
- **Decentralized** blockchain network.
- **Consensus algorithms** (longest chain rule) to verify that the network nodes have **valid data** and are **synchronized**.
- **Broadcasting system** to keep the data in the blockchain **network synchronized**.

## How to use this project:

- Clone the project: **git@github.com:michaelbretagne/pow_blockchain.git**
- Install packages: **npm install**
- Open terminal. In 5 tabs start each node: **npm run node\_\***
- Go to **localhost:3001/blockchain** to see the blockchain data.
- Use **postman** to interact with the blockchain:
  - Connect all nodes with each other: 
         - POST **localhost/3001/register-and-broadcast-node**
          - e.g of body: `{ "newNodeUrl": "http://localhost:3002" }`
  - Create a transaction: 
         - POST **localhost:3001/transaction/broadcast**
          - e.g of body: `{ "amount": 120, "sender": "3dw13omsjxdi6dsf7nbj9vvybbdjas", "recipient": "1jmd4k8wndk7kuhungbcvbnkmnkjkw" }`
- Go to **localhost:3001/mine** to mine transactions and create new blocks.
- Go to **localhost:3001/address/:address** to get all the transactions of an address.
- Go to **localhost:3001/transaction/:transactionId** to get all the details of a transaction.
- Go to **localhost:3001/block/:blockHash** to get all the details of a block.
