var assert = require("assert");
const Blockchain = require("../blockchain");

let bitcoin;

beforeEach(() => {
  // Create the genesis block
  bitcoin = new Blockchain();
  // Create new blocs
  bitcoin.createNewBlock(2345, "sb2hv5daduydBjb", "ud2hdib3uwbd74beb");
  bitcoin.createNewBlock(4355, "u855evdvfdufgfy", "dcsfcsdvg6r43d324");
  bitcoin.createNewBlock(7658, "4gfdbdsbdaduydB", "9rcst6gr57hrtbvrd");
  // Add a transaction into pendingTransaction
  bitcoin.addTransactionToPendingTransaction({
    amount: 10,
    sender: "ALICE012904214019412",
    recipient: "BOB0ddew32hw329d2h",
  });
});

describe("Blockchain()", () => {
  it("should get the genesis block", () => {
    assert.equal(bitcoin.chain[0].index, 1);
  });

  it("should have 3 blocks in the chain", () => {
    assert.equal(bitcoin.chain[3].index, 4);
  });

  it("should get the last block", () => {
    assert.equal(bitcoin.getLastBlock().index, 4);
  });

  it("should have one pendingTransaction", () => {
    assert.equal(bitcoin.pendingTransactions.length, 1);
  });

  it("should get a hash", () => {
    const previousBlockHash = "9rcst6gr57hrtbvrd";
    const currentBlockData = [
      {
        amount: 111,
        sender: "dnwxninxiswnxiue2348urd",
        recipient: "iewnuinxinxinxinwiinewi",
      },
      {
        amount: 20,
        sender: "asdsadsaaswnxiue2348urd",
        recipient: "dasdafvnxinxinxinwiinewi",
      },
      {
        amount: 43,
        sender: "aeffdainxiswnxiue2348urd",
        recipient: "asdnuinxinxinxinwiinewi",
      },
    ];
    const nonce = 100;
    assert.equal(
      bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce),
      "09347502e8228fb3e80cd1ea6d217173eeffe7a028cd6d47bc3e57837771e88b",
    );
  });

  it("should return a nonce as a proof of work", () => {
    const previousBlockHash = "9rcst6gr57hrtbvrd";
    const currentBlockData = [
      {
        amount: 111,
        sender: "dnwxninxiswnxiue2348urd",
        recipient: "iewnuinxinxinxinwiinewi",
      },
      {
        amount: 20,
        sender: "asdsadsaaswnxiue2348urd",
        recipient: "dasdafvnxinxinxinwiinewi",
      },
    ];
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    assert.ok(nonce);
    assert.equal(
      bitcoin
        .hashBlock(previousBlockHash, currentBlockData, nonce)
        .substring(0, 4),
      "0000",
    );
  });

  it("should not have a pending transaction after creating a block", () => {
    assert.equal(bitcoin.pendingTransactions.length, 1);
    bitcoin.createNewBlock(4355, "u855evdvfdufgfy", "dcsfcsdvg6r43d324");
    assert.equal(bitcoin.pendingTransactions.length, 0);
  });

  it("should get a valid chain", () => {
    const bc1 = {
      chain: [
        {
          index: 1,
          timestamp: 1534057462787,
          transactions: [],
          nonce: 0,
          hash: "0",
          previousBlockHash: "0",
        },
        {
          index: 2,
          timestamp: 1534057489532,
          transactions: [
            {
              transactionId: "fac018609dfd11e8b7bad7e81c180e90",
              amount: 20,
              sender: "nbjvhvydybjbdjas",
              recipient: "kuhungbcvbnkmnkjkw",
            },
            {
              transactionId: "fdf552c09dfd11e8b7bad7e81c180e90",
              amount: 30,
              sender: "nbjvhvydybjbdjas",
              recipient: "kuhungbcvbnkmnkjkw",
            },
          ],
          nonce: 16917,
          hash:
            "0000faa18e40a39c703dd10b3546de4815366c01205e439b236b770c96ff31d7",
          previousBlockHash: "0",
        },
      ],
      pendingTransactions: [
        {
          transactionId: "00ccb5b09dfe11e8b7bad7e81c180e90",
          amount: 12.5,
          sender: "00",
          recipient: "f0d927109dfd11e8b7bad7e81c180e90",
        },
      ],
      currentNodeUrl: "http://localhost:3001",
      networkNodes: [],
    };

    assert.ok(bitcoin.chainIsValid(bc1.chain));
  });

  it("should NOT get a valid chain", () => {
    const bc1 = {
      chain: [
        {
          index: 1,
          timestamp: 1534057462787,
          transactions: [],
          nonce: 0,
          hash: "0",
          previousBlockHash: "0",
        },
        {
          index: 2,
          timestamp: 1534057489532,
          transactions: [
            {
              transactionId: "fac018609dfd11e8b7bad7e81c180e90",
              amount: 20,
              sender: "nbjvhvydybjbdjas",
              recipient: "kuhungbcvbnkmnkjkw",
            },
            {
              transactionId: "fdf552c09dfd11e8b7bad7e81c180e90",
              amount: 30,
              sender: "nbjvhvydybjbdjas",
              recipient: "kuhungbcvbnkmnkjkw",
            },
          ],
          nonce: 16917,
          hash:
            "0000faa18e40a39c703dd10b3546de4815366c01205e439b236b770c96ff31d7",
          previousBlockHash: "00",
        },
      ],
      pendingTransactions: [
        {
          transactionId: "00ccb5b09dfe11e8b7bad7e81c180e90",
          amount: 12.5,
          sender: "00",
          recipient: "f0d927109dfd11e8b7bad7e81c180e90",
        },
      ],
      currentNodeUrl: "http://localhost:3001",
      networkNodes: [],
    };

    assert.equal(bitcoin.chainIsValid(bc1.chain), false);
  });
});
