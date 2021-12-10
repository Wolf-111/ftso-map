const Web3 = require("web3");
const rpcURL = "https://songbird.towolabs.com/rpc"; // Your RPC URL goes here
const Contract = require("web3-eth-contract");
const web3 = new Web3(rpcURL);
const address = "0xd54c8524c5Ff3A1Fc89304558183768CC61C348d"; // Your account address goes here
const fs = require("fs");

let providersABI = [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      { type: "address", name: "_governance", internalType: "address" },
      {
        type: "address",
        name: "_priceSubmitter",
        internalType: "contract IIPriceSubmitter",
      },
      {
        type: "uint256",
        name: "_defaultMaxVotersForFtso",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "event",
    name: "GovernanceProposed",
    inputs: [
      {
        type: "address",
        name: "proposedGovernance",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GovernanceUpdated",
    inputs: [
      {
        type: "address",
        name: "oldGovernance",
        internalType: "address",
        indexed: false,
      },
      {
        type: "address",
        name: "newGoveranance",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VoterRemovedFromWhitelist",
    inputs: [
      {
        type: "address",
        name: "voter",
        internalType: "address",
        indexed: false,
      },
      {
        type: "uint256",
        name: "ftsoIndex",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VoterWhitelisted",
    inputs: [
      {
        type: "address",
        name: "voter",
        internalType: "address",
        indexed: false,
      },
      {
        type: "uint256",
        name: "ftsoIndex",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "addFtso",
    inputs: [{ type: "uint256", name: "_ftsoIndex", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "claimGovernance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "defaultMaxVotersForFtso",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "ftsoManager",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "", internalType: "contract IFtsoRegistry" },
    ],
    name: "ftsoRegistry",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address[]", name: "", internalType: "address[]" }],
    name: "getFtsoWhitelistedPriceProviders",
    inputs: [{ type: "uint256", name: "_ftsoIndex", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address[]", name: "", internalType: "address[]" }],
    name: "getFtsoWhitelistedPriceProvidersBySymbol",
    inputs: [{ type: "string", name: "_symbol", internalType: "string" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "governance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "initialise",
    inputs: [{ type: "address", name: "_governance", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "maxVotersForFtso",
    inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "", internalType: "contract IIPriceSubmitter" },
    ],
    name: "priceSubmitter",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "proposeGovernance",
    inputs: [{ type: "address", name: "_governance", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "proposedGovernance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "removeFtso",
    inputs: [{ type: "uint256", name: "_ftsoIndex", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "removeTrustedAddressFromWhitelist",
    inputs: [
      { type: "address", name: "_trustedAddress", internalType: "address" },
      { type: "uint256", name: "_ftsoIndex", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [
      {
        type: "uint256[]",
        name: "_supportedIndices",
        internalType: "uint256[]",
      },
      { type: "bool[]", name: "_success", internalType: "bool[]" },
    ],
    name: "requestFullVoterWhitelisting",
    inputs: [{ type: "address", name: "_voter", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "requestWhitelistingVoter",
    inputs: [
      { type: "address", name: "_voter", internalType: "address" },
      { type: "uint256", name: "_ftsoIndex", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setContractAddresses",
    inputs: [
      {
        type: "address",
        name: "_ftsoRegistry",
        internalType: "contract IFtsoRegistry",
      },
      { type: "address", name: "_ftsoManager", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setDefaultMaxVotersForFtso",
    inputs: [
      {
        type: "uint256",
        name: "_defaultMaxVotersForFtso",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setMaxVotersForFtso",
    inputs: [
      { type: "uint256", name: "_ftsoIndex", internalType: "uint256" },
      { type: "uint256", name: "_newMaxVoters", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "transferGovernance",
    inputs: [{ type: "address", name: "_governance", internalType: "address" }],
  },
];

let votePowerABI = [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      { type: "address", name: "_governance", internalType: "address" },
      { type: "string", name: "_name", internalType: "string" },
      { type: "string", name: "_symbol", internalType: "string" },
    ],
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      {
        type: "address",
        name: "owner",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "spender",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "value",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CreatedTotalSupplyCache",
    inputs: [
      {
        type: "uint256",
        name: "_blockNumber",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      { type: "address", name: "dst", internalType: "address", indexed: true },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GovernanceProposed",
    inputs: [
      {
        type: "address",
        name: "proposedGovernance",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GovernanceUpdated",
    inputs: [
      {
        type: "address",
        name: "oldGovernance",
        internalType: "address",
        indexed: false,
      },
      {
        type: "address",
        name: "newGoveranance",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { type: "address", name: "from", internalType: "address", indexed: true },
      { type: "address", name: "to", internalType: "address", indexed: true },
      {
        type: "uint256",
        name: "value",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VotePowerContractChanged",
    inputs: [
      {
        type: "uint256",
        name: "_contractType",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "address",
        name: "_oldContractAddress",
        internalType: "address",
        indexed: false,
      },
      {
        type: "address",
        name: "_newContractAddress",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdrawal",
    inputs: [
      { type: "address", name: "src", internalType: "address", indexed: true },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "allowance",
    inputs: [
      { type: "address", name: "owner", internalType: "address" },
      { type: "address", name: "spender", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "approve",
    inputs: [
      { type: "address", name: "spender", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "balanceHistoryCleanup",
    inputs: [
      { type: "address", name: "_owner", internalType: "address" },
      { type: "uint256", name: "_count", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "balanceOf",
    inputs: [{ type: "address", name: "account", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "balanceOfAt",
    inputs: [
      { type: "address", name: "_owner", internalType: "address" },
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256[]", name: "", internalType: "uint256[]" }],
    name: "batchVotePowerOfAt",
    inputs: [
      { type: "address[]", name: "_owners", internalType: "address[]" },
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "claimGovernance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "cleanupBlockNumber",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint8", name: "", internalType: "uint8" }],
    name: "decimals",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "decreaseAllowance",
    inputs: [
      { type: "address", name: "spender", internalType: "address" },
      { type: "uint256", name: "subtractedValue", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "delegate",
    inputs: [
      { type: "address", name: "_to", internalType: "address" },
      { type: "uint256", name: "_bips", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "delegateExplicit",
    inputs: [
      { type: "address", name: "_to", internalType: "address" },
      { type: "uint256", name: "_amount", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address[]",
        name: "_delegateAddresses",
        internalType: "address[]",
      },
      { type: "uint256[]", name: "_bips", internalType: "uint256[]" },
      { type: "uint256", name: "_count", internalType: "uint256" },
      { type: "uint256", name: "_delegationMode", internalType: "uint256" },
    ],
    name: "delegatesOf",
    inputs: [{ type: "address", name: "_owner", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address[]",
        name: "_delegateAddresses",
        internalType: "address[]",
      },
      { type: "uint256[]", name: "_bips", internalType: "uint256[]" },
      { type: "uint256", name: "_count", internalType: "uint256" },
      { type: "uint256", name: "_delegationMode", internalType: "uint256" },
    ],
    name: "delegatesOfAt",
    inputs: [
      { type: "address", name: "_owner", internalType: "address" },
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "delegationModeOf",
    inputs: [{ type: "address", name: "_who", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "payable",
    outputs: [],
    name: "deposit",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "payable",
    outputs: [],
    name: "depositTo",
    inputs: [{ type: "address", name: "recipient", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "governance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address",
        name: "",
        internalType: "contract IGovernanceVotePower",
      },
    ],
    name: "governanceVotePower",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "increaseAllowance",
    inputs: [
      { type: "address", name: "spender", internalType: "address" },
      { type: "uint256", name: "addedValue", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "initialise",
    inputs: [{ type: "address", name: "_governance", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "string", name: "", internalType: "string" }],
    name: "name",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "needsReplacementVPContract",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "proposeGovernance",
    inputs: [{ type: "address", name: "_governance", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "proposedGovernance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "", internalType: "contract IVPContractEvents" },
    ],
    name: "readVotePowerContract",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "revokeDelegationAt",
    inputs: [
      { type: "address", name: "_who", internalType: "address" },
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setCleanerContract",
    inputs: [
      { type: "address", name: "_cleanerContract", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setCleanupBlockNumber",
    inputs: [
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setCleanupBlockNumberManager",
    inputs: [
      {
        type: "address",
        name: "_cleanupBlockNumberManager",
        internalType: "address",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setGovernanceVotePower",
    inputs: [
      {
        type: "address",
        name: "_governanceVotePower",
        internalType: "contract IIGovernanceVotePower",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setReadVpContract",
    inputs: [
      {
        type: "address",
        name: "_vpContract",
        internalType: "contract IIVPContract",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setWriteVpContract",
    inputs: [
      {
        type: "address",
        name: "_vpContract",
        internalType: "contract IIVPContract",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "string", name: "", internalType: "string" }],
    name: "symbol",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "totalSupply",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "totalSupplyAt",
    inputs: [
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "totalSupplyCacheCleanup",
    inputs: [
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "totalSupplyHistoryCleanup",
    inputs: [{ type: "uint256", name: "_count", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "totalVotePower",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "totalVotePowerAt",
    inputs: [
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "totalVotePowerAtCached",
    inputs: [
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "transfer",
    inputs: [
      { type: "address", name: "recipient", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "transferFrom",
    inputs: [
      { type: "address", name: "sender", internalType: "address" },
      { type: "address", name: "recipient", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "transferGovernance",
    inputs: [{ type: "address", name: "_governance", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "undelegateAll",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [
      {
        type: "uint256",
        name: "_remainingDelegation",
        internalType: "uint256",
      },
    ],
    name: "undelegateAllExplicit",
    inputs: [
      {
        type: "address[]",
        name: "_delegateAddresses",
        internalType: "address[]",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "undelegatedVotePowerOf",
    inputs: [{ type: "address", name: "_owner", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "undelegatedVotePowerOfAt",
    inputs: [
      { type: "address", name: "_owner", internalType: "address" },
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "votePowerFromTo",
    inputs: [
      { type: "address", name: "_from", internalType: "address" },
      { type: "address", name: "_to", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "votePowerFromToAt",
    inputs: [
      { type: "address", name: "_from", internalType: "address" },
      { type: "address", name: "_to", internalType: "address" },
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "votePowerOf",
    inputs: [{ type: "address", name: "_owner", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "votePowerOfAt",
    inputs: [
      { type: "address", name: "_owner", internalType: "address" },
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "votePowerOfAtCached",
    inputs: [
      { type: "address", name: "_owner", internalType: "address" },
      { type: "uint256", name: "_blockNumber", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "withdraw",
    inputs: [{ type: "uint256", name: "amount", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "withdrawFrom",
    inputs: [
      { type: "address", name: "owner", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "", internalType: "contract IVPContractEvents" },
    ],
    name: "writeVotePowerContract",
    inputs: [],
  },
  { type: "receive", stateMutability: "payable" },
];

let providersContract = new web3.eth.Contract(
  providersABI,
  "0xa76906EfBA6dFAe155FfC4c0eb36cDF0A28ae24D"
);
let providers = providersContract.methods
  .getFtsoWhitelistedPriceProviders(1)
  .call();

let votePowerContract = new web3.eth.Contract(
  votePowerABI,
  "0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED"
);

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

Promise.resolve(providers).then((data) => {
  let arr = [];
  let mapped = data.map((address, i) => {
    setTimeout(() => {
      return Promise.resolve(
        votePowerContract.methods.votePowerOf(address).call()
      ).then((votePower) => {
        arr.push({
          address: address,
          votePower: Web3.utils.fromWei(votePower, "ether"),
        });
        console.log(arr);
        fs.writeFile("./object.json", JSON.stringify(arr, null, 4), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("File has been created");
        });
        return {
          address: address,
          votePower: Web3.utils.fromWei(votePower, "ether"),
        };
      });
    }, 1500);
  });
  return mapped;
});
