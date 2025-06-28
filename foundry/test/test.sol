// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Marketplace.sol";

contract MarketplaceTest is Test {
    Marketplace public marketplace;

    address user1 = address(0x1);
    address user2 = address(0x2);
    address user3 = address(0x3);

    function setUp() public {
        marketplace = new Marketplace();
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
        vm.deal(user3, 100 ether);
    }

    function testMultipleUsersTrade() public {
        vm.startPrank(user1);
        marketplace.addProduct("apple", 1 ether, 100);
        vm.stopPrank();

        vm.startPrank(user2);
        marketplace.addProduct("banana", 2 ether, 50);
        vm.stopPrank();

        vm.startPrank(user3);
        marketplace.addProduct("carrot", 3 ether, 30);
        vm.stopPrank();

        vm.startPrank(user2);
        marketplace.buyProduct{value: 2 ether}(1, 2);
        vm.stopPrank();


        vm.startPrank(user3);
        marketplace.buyProduct{value: 3 ether}(1, 3);
        marketplace.buyProduct{value: 2 ether}(2, 1);
        vm.stopPrank();

        assertEq(user1.balance, 105 ether); // 5 ether from sales
        assertEq(user2.balance, 100 ether); // -2 ether from apple buy, 2 ether from banana sale 
        assertEq(user3.balance, 95 ether);  // 5 ether spent

        (, , , , uint256 appleQty) = marketplace.products(1);
        (, , , , uint256 bananaQty) = marketplace.products(2);
        assertEq(appleQty, 95);   // 5 sold
        assertEq(bananaQty, 49);  // 1 sold

        Marketplace.Purchase[] memory purchases = marketplace.getMyPurchases(user3);
        assertEq(purchases.length, 2);
        assertEq(purchases[0].productId, 1);
        assertEq(purchases[0].amount, 3);
        assertEq(purchases[1].productId, 2);
        assertEq(purchases[1].amount, 1);
        assertEq(marketplace.totalSpentByUser(user3),5 ether);
    }

    function testRevertOnInsufficientBalance() public {
        vm.prank(user1);
        marketplace.addProduct("apple", 10 ether, 10);

        vm.prank(user2);
        vm.expectRevert("Incorrect Ether sent");
        marketplace.buyProduct{value: 2 ether}(1, 5);
    }

    function testRevertOnInsufficientStock() public {
        vm.prank(user1);
        marketplace.addProduct("apple", 1 ether, 2);

        vm.prank(user2);
        vm.expectRevert("Not enough stock");
        marketplace.buyProduct{value: 5 ether}(1, 5);
    }

    function testExpectProductPurchasedEvent() public {
        vm.prank(user1);
        marketplace.addProduct("apple", 1 ether, 10);

        vm.prank(user2);
        vm.expectEmit(true, true, false, true);
        emit Marketplace.ProductPurchased(user2, 1, 3, 3 ether);

        marketplace.buyProduct{value: 3 ether}(1, 3);
    }

}
