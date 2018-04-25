pragma solidity ^0.4.18;

contract SimpleStorage {
  uint storedData = 0;

  function set(uint x) public {
    storedData = x;
  }

  function add(uint x) public {
    storedData += x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
