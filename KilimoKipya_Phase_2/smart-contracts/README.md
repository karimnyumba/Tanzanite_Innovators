# Kilimo Kipya Smart Contracts

This repository contains smart contracts for the **Kilimo Kipya** project, designed to enhance agricultural traceability, credit granting, and insurance management for farmers. The contracts are deployed on the **Sepolia Network**.

- **Contract Address**: `0x6713790CFdDaBcDE2000b21d1085D21497eD2478`
- **Solidity Version**: `^0.8.20`

## Folder Structure

```bash
kilimo-kipya/
├── contracts/
│   └── kilimo-kipya.sol
├── ignition/
│   └── modules/
├── test/
│   └── Lock.ts
├── .gitignore
├── hardhat.config.ts
├── package-lock.json
├── package.json
└── tsconfig.json
```
## Contract Overview
The KilimoKipya contract facilitates the following features:
-  Product Management: Farmers can add and transfer ownership of products.
-  Quality Control: Quality certifiers can certify or fail products after quality checks.
-  Credit & Insurance: Banks can grant credit to farmers and issue insurance policies.
-  Traceability: Products can be traced across their lifecycle, with details about their origin, certification, and quality status.

## Events
The contract emits several events:

-  ProductAdded: Emitted when a new product is registered.
-  ProductTransferred: Emitted when a product is transferred between owners.
-  ProductCertified: Emitted when a product is certified by the owner.
-  CreditGranted: Emitted when credit is granted to a farmer.
-  InsuranceClaimed: Emitted when an insurance claim is made.
-  QualityCheckPassed/Failed: Emitted after quality checks are performed.

## State Variables
-  Farmers: Stores registered farmers and their product ownerships.
-  Banks: Stores registered banks that can issue credit and insurance.
-  Products: Stores product information including origin, certification, and quality status.
-  Certifiers: Stores details of quality certifiers.

