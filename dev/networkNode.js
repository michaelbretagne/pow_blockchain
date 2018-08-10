var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid/v1");
const port = process.argv[2];
const rp = require("request-promise");

const nodeAddress = uuid()
  .split("-")
  .join("");

const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/blockchain", (req, res) => {
  res.send(bitcoin);
});

app.post("/transaction", (req, res) => {
  const newTransaction = req.body;
  const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.post("/transaction/broadcast", (req, res) => {
  const { amount, sender, recipient } = req.body;
  const newTransaction = bitcoin.createNewTransaction(
    amount,
    sender,
    recipient,
  );
  bitcoin.addTransactionToPendingTransaction(newTransaction);

  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then(data =>
    res.json({ note: "Transaction created and broadcasted successfully." }),
  );
});

app.get("/mine", (req, res) => {
  const lastBlock = bitcoin.getLastBlock();

  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transaction: bitcoin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce,
  );

  bitcoin.createNewTransaction(12.5, "00", nodeAddress);

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  res.json({
    note: "New block mined successfully",
    block: newBlock,
  });
});

// register a node and broadcast it to the network
app.post("/register-and-broadcast-node", (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  // Add node url to networkNodes arr if not already registered
  if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }
  // Arr of the promises results of the request bellow
  const regNodesPromises = [];
  // Request for each node
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl },
      json: true,
    };

    regNodesPromises.push(rp(requestOptions));
  });
  // Register node to the network
  Promise.all(regNodesPromises)
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
        },
        json: true,
      };

      return rp(bulkRegisterOptions);
    })
    .then(data => {
      res.json({ note: "New node registered with network successfully" });
    });
});

// register a node with the network
app.post("/register-node", (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode) {
    bitcoin.networkNodes.push(newNodeUrl);
  }
  res.json({ note: "New node registered successfully." });
});

// register multiple nodes  at once
app.post("/register-nodes-bulk", (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent =
      bitcoin.networkNodes.indexOf(networkNodeUrl) === -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) {
      bitcoin.networkNodes.push(networkNodeUrl);
    }
  });
  res.json({ note: "Bulk registration successful." });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
