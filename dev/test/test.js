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

  it("should create a new transaction", () => {
    assert.equal(
      bitcoin.createNewTransaction(
        10,
        "ALICE012904214019412",
        "BOB0ddew32hw329d2h",
      ),
      5,
    );
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
});
