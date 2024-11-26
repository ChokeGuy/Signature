//VerifySignature.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Signature {
    address owner;
    uint256 public totalAmount = 2000;
    mapping(address => uint256) balances;

    modifier onlyOwner() {
        require(msg.sender == owner, 'Not the owner');
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function verify(
        uint256 amount,
        bytes memory signature
    ) internal view returns (bool) {
        bytes32 messageHash = _getMessageHash(amount);

        bytes32 ethSignedMessageHash = _getEthSignedMessageHash(messageHash);

        return recover(ethSignedMessageHash, signature) == owner;
    }

    function getToken(uint256 amount, bytes memory signature) public {
        require(verify(amount, signature), 'Invalid Signature');

        require(amount < totalAmount, 'Not Enough Amount');

        balances[msg.sender] += amount;
        totalAmount -= amount;
    }

    function _getMessageHash(uint256 amount) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(amount));
    }

    function _getEthSignedMessageHash(
        bytes32 messageHash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    '\x19Ethereum Signed Message:\n32',
                    messageHash
                )
            );
    }

    function recover(
        bytes32 hash,
        bytes memory signature
    ) internal pure returns (address) {
        require(signature.length == 65, 'invalid signature length');
        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly ('memory-safe') {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        return ecrecover(hash, v, r, s);
    }

    function balanceOf(
        address account
    ) public view onlyOwner returns (uint256) {
        return balances[account];
    }
}
