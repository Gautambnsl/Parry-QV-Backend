require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Replace with your contract address and ABI
const CONTRACT_ABI = [
  "function executeMetaTransaction(address sender, bytes txData) public",
];

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Replace with your provider URL (e.g., Infura)
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Replace with your private key
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

app.post("/factory-execute-meta-transaction", async (req, res) => {
  try {
    const { sender, txData } = req.body;

    const tx = await contract.executeMetaTransaction(sender, txData);
    await tx.wait();

    res.json({
      success: true,
      hash: tx.hash,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/QV-execute-meta-transaction", async (req, res) => {
  try {
    const { sender, txData, contractAddress } = req.body;

    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
    const tx = await contract.executeMetaTransaction(sender, txData);
    await tx.wait();

    res.json({
      success: true,
      hash: tx.hash,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  const now = new Date().toLocaleString(); // Get the current timestamp
  console.log(`Server running on port ${PORT} - Started at ${now}`);
});
