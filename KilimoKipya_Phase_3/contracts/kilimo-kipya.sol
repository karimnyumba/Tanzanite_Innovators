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




    enum QualityStatus { NotChecked, Passed, Failed }
 
    struct Product {
        uint id;
        string name;
        string origin;
        string certification;
        address currentOwner;
        uint timestamp;
        uint256 quantity;
        string unit;
        string harvestDate;
        string location;
        QualityStatus qualityStatus;
        string[] qualityChecks;
    }

    struct Farmer {
        address farmerAddress;
        string farmerUUID; //  as registered on the centralized DB
        uint creditRating;
        uint[] ownedProducts;
    }

    struct Bank {
        address bankAddress;
        string bankName;
    }

    struct Insurance {
        address farmer;
        uint coverageAmount;
        string coverageDetails;
        bool active;
    }

    struct QualityCertifier {
        address certifierAddress;
        string certifierName;
        string certifierLicense;
    }

    // State Variables
    uint public productCounter;
    uint256 public totalProducts;
    address public owner;

    mapping(uint => Product) public products;
    mapping(address => Farmer) public farmers;
    mapping(address => Bank) public banks;
    mapping(address => Insurance) public insurancePolicies;
    mapping(uint256 => Product) public traceabilityProducts;
    mapping(address => QualityCertifier) public certifiers;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyFarmer() {
        require(bytes(farmers[msg.sender].farmerUUID).length != 0, "Not a registered farmer");
        _;
    }

    modifier onlyBank() {
        require(bytes(banks[msg.sender].bankName).length != 0, "Not a registered bank");
        _;
    }

    modifier onlyInsured() {
        require(insurancePolicies[msg.sender].active, "No active insurance policy");
        _;
    }

    modifier onlyCertifier() {
        require(certifiers[msg.sender].certifierAddress != address(0), "Not a registered certifier");
        _;
    }

    modifier onlyRegisteredProduct(uint _productId) {
        require(products[_productId].id != 0, "Product not registered");
        _;
    }

   
    constructor() {
        owner = msg.sender;
    }

    
    function registerFarmer(string memory _farmeruuid) public {
        require(bytes(farmers[msg.sender].farmerUUID).length == 0, "Farmer already registered");
        farmers[msg.sender] = Farmer(msg.sender,_farmeruuid, 0, new uint[](0));
    }
 
    function registerBank(string memory _bankuuid) public {
        require(bytes(banks[msg.sender].bankName).length == 0, "Bank already registered");
        banks[msg.sender] = Bank(msg.sender, _bankuuid);
    }

    
    function registerCertifier(
        address _certifierAddress,
        string memory _certifierName,
        string memory _certifierLicense
    ) public onlyOwner {
        certifiers[_certifierAddress] = QualityCertifier({
            certifierAddress: _certifierAddress,
            certifierName: _certifierName,
            certifierLicense: _certifierLicense
        });
    }

  
    function addProduct(
        string memory _name,
        string memory _origin,
        uint256 _quantity,
        string memory _unit,
        string memory _harvestDate,
        string memory _location
    ) public onlyFarmer {
        productCounter++;
        products[productCounter] = Product({
            id: productCounter,
            name: _name,
            origin: _origin,
            certification: "",
            currentOwner: msg.sender,
            timestamp: block.timestamp,
            quantity: _quantity,
            unit: _unit,
            harvestDate: _harvestDate,
            location: _location,
            qualityStatus: QualityStatus.NotChecked,
            qualityChecks: new string[] (0)
        });
        farmers[msg.sender].ownedProducts.push(productCounter);

        emit ProductAdded(productCounter, _name, _origin, "", msg.sender);
        emit ProductRegistered(productCounter, msg.sender);
    }
 
    
    function transferProduct(uint _productId, address _newOwner) public onlyRegisteredProduct(_productId) {
        require(products[_productId].currentOwner == msg.sender, "Not the owner");
        products[_productId].currentOwner = _newOwner;

        emit ProductTransferred(_productId, msg.sender, _newOwner, block.timestamp);
    }

   
    function certifyProduct(uint _productId, string memory _certification) public onlyOwner onlyRegisteredProduct(_productId) {
        require(bytes(products[_productId].certification).length == 0, "Already certified");
        products[_productId].certification = _certification;

        emit ProductCertified(_productId, _certification, block.timestamp);
    }

    
    function performQualityCheck(
        uint256 _productId,
        bool _passed,
        string memory _details
    ) public onlyCertifier onlyRegisteredProduct(_productId) {
        if (_passed) {
            products[_productId].qualityStatus = QualityStatus.Passed;
            products[_productId].qualityChecks.push(_details);
            emit QualityCheckPassed(_productId, msg.sender, _details);
        } else {
            products[_productId].qualityStatus = QualityStatus.Failed;
            products[_productId].qualityChecks.push(_details);
            emit QualityCheckFailed(_productId, msg.sender, _details);
        }
    }

  

  
    function issueInsurance(address _farmer, uint _coverageAmount, string memory _coverageDetails) public onlyBank {
        require(!insurancePolicies[_farmer].active, "Active insurance already exists");
        insurancePolicies[_farmer] = Insurance(_farmer, _coverageAmount, _coverageDetails, true);
    }

    
    function claimInsurance(uint _amount, string memory _reason) public onlyInsured {
        require(insurancePolicies[msg.sender].coverageAmount >= _amount, "Insufficient coverage");

     
        insurancePolicies[msg.sender].coverageAmount -= _amount;

        emit InsuranceClaimed(msg.sender, _amount, _reason, block.timestamp);
    }

    
    function getCreditRating(address _farmeruuid) public view returns (uint) {
        return farmers[_farmeruuid].creditRating;
    }

    
    function getProductDetails(uint _productId) public view returns (
        string memory name,
        string memory origin,
        string memory certification,
        address currentOwner,
        uint timestamp,
        uint256 quantity,
        string memory unit,
        string memory harvestDate,
        string memory location,
        QualityStatus qualityStatus,
        string[] memory qualityChecks
    ) {
        Product memory product = products[_productId];
        return (
            product.name,
            product.origin,
            product.certification,
            product.currentOwner,
            product.timestamp,
            product.quantity,
            product.unit,
            product.harvestDate,
            product.location,
            product.qualityStatus,
            product.qualityChecks
        );
    }

 
    function getFarmerProducts(address _farmer) public view returns (uint[] memory) {
        return farmers[_farmer].ownedProducts;
    }

 
 
   
    function getCertifierDetails(address _certifierAddress) public view returns (
        string memory certifierName,
        string memory certifierLicense
    ) {
        QualityCertifier storage certifier = certifiers[_certifierAddress];
        return (certifier.certifierName, certifier.certifierLicense);
    }

}