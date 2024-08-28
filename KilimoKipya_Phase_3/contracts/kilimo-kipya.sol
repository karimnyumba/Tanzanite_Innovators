// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KilimoKipya {

     
    event ProductAdded(uint productId, string productName, string origin, string certification, address farmer);
    event ProductTransferred(uint productId, address indexed from, address indexed to, uint timestamp);
    event ProductCertified(uint productId, string certification, uint timestamp);
    event CreditGranted(address indexed farmer, uint amount, uint timestamp);
    event InsuranceClaimed(address indexed farmer, uint amount, string reason, uint timestamp);
    event ProductRegistered(uint256 productId, address indexed farmerAddress);
    event ProductBatchUpdated(uint256 productId, string batchInfo, address indexed updater);
    event QualityCheckPassed(uint256 productId, address indexed certifier, string details);
    event QualityCheckFailed(uint256 productId, address indexed certifier, string reason);

}