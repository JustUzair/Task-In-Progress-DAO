// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @custom:security-contact uzairhajra76330@gmail.com
contract TIP is
  ERC20,
  ERC20Burnable,
  Pausable,
  Ownable,
  ERC20Permit,
  ERC20Votes
{
  uint256 public postThreshold;
  uint256 public commentThreshold;

  constructor() ERC20("TIP", "TIP") ERC20Permit("TIP") {
    _mint(msg.sender, 10000000 * 10 ** decimals());
    postThreshold = 100 * 10 ** decimals();
    commentThreshold = 25 * 10 ** decimals();
  }

  function changePostThreshold(uint256 newThreshold) public onlyOwner {
    postThreshold = newThreshold * 10 ** decimals();
  }

  function changeCommentThreshold(uint256 newThreshold) public onlyOwner {
    commentThreshold = newThreshold * 10 ** decimals();
  }

  function canPost(address from) public view returns (bool) {
    return balanceOf(from) >= postThreshold;
  }

  function canComment(address from) public view returns (bool) {
    return balanceOf(from) >= commentThreshold;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override whenNotPaused {
    super._beforeTokenTransfer(from, to, amount);
  }

  // The following functions are overrides required by Solidity.

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._mint(to, amount);
  }

  function _burn(
    address account,
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._burn(account, amount);
  }
}
