// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct Product {
        uint256 id;
        address seller;
        string name;
        uint256 price;
        uint256 quantity;
    }

    struct Purchase {
        uint256 productId;
        address buyer;
        uint256 amount;
    }

    event ProductPurchased(address indexed buyer, uint256 productId, uint256 amount, uint256 totalPaid);
    event ProductAdded(uint256 productId, address indexed seller, string name, uint256 price, uint256 quantity);

    uint256 public nextProductId = 1;
    mapping(uint256 => Product) public products;
    mapping(address => Purchase[]) public purchases;
    mapping(address => uint256) public totalSpentByUser;

    // 상품 등록
    function addProduct(string memory name, uint256 price, uint256 quantity) external {
        products[nextProductId] = Product({
            id: nextProductId,
            seller: msg.sender,
            name: name,
            price: price,
            quantity: quantity
        });

        emit ProductAdded(nextProductId, msg.sender, name, price, quantity);
        nextProductId++;
    }

    function updateProduct(uint256 productId, uint256 newPrice, uint256 newQuantity) external {
        Product storage product = products[productId];
        require(product.seller == msg.sender, "Only seller can update");
        product.price = newPrice;
        product.quantity = newQuantity;
    }

    function buyProduct(uint256 productId, uint256 amount) external payable {
        Product storage product = products[productId];
        require(product.quantity >= amount, "Not enough stock");

        uint256 totalPrice = product.price * amount;
        require(msg.value == totalPrice, "Incorrect Ether sent");


        (bool success, ) = payable(product.seller).call{value: totalPrice}("");
        require(success, "Payment failed");

        product.quantity -= amount;
        purchases[msg.sender].push(Purchase(productId, msg.sender, amount));

        totalSpentByUser[msg.sender] += totalPrice;

        emit ProductPurchased(msg.sender, productId, amount, totalPrice);
    }

    function getMyPurchases(address buyer) external view returns (Purchase[] memory) {
        return purchases[buyer];
    }

    function getAllProducts() external view returns (Product[] memory) {
        Product[] memory result = new Product[](nextProductId - 1);
        for (uint256 i = 1; i < nextProductId; i++) {
            result[i - 1] = products[i];
        }
        return result;
    }

    function getMyProducts() external view returns (Product[] memory) {
        uint256 count;
        for (uint256 i = 1; i < nextProductId; i++) {
            if (products[i].seller == msg.sender) {
                count++;
            }
        }

        Product[] memory myProducts = new Product[](count);
        uint256 index;
        for (uint256 i = 1; i < nextProductId; i++) {
            if (products[i].seller == msg.sender) {
                myProducts[index] = products[i];
                index++;
            }
        }

        return myProducts;
    }

    function getProductName(uint256 productId) external view returns (string memory) {
        return products[productId].name;
    }

    function getBalance(address user) external view returns (uint256) {
        return user.balance;
    }
}
