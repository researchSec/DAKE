// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.7.0;

import "./BigMod.sol";

contract SmartDiffieHellman {
	using BigMod for uint256;

	uint256 public P = 0xF3EC75CC015A7F458C242E37C292EEF96C40CFB670ED8CFF3BBA27EE3301205B; // openssl dhparam 256 | openssl asn1parse
	uint256 public G = 2;

	uint256 public B;

	address other;

	string public jsInitTransmit = "let random = [...Array(32)].map(() => parseInt(Math.random() * 255)); let genAa = await dhInst1.generateA.call(random); await dhInst1.transmitA(dhInst2.address, genAa[\"_A\"]); return genAa;";
	string public jsCalcSecret = "return await dhInst.generateAB.call(genAa[\"_a\"]);";

	function generateA(uint256[] memory _seed) public view returns (uint256 _a, uint256 _A) {
		assert(P != 0);
		assert(G != 0);

		_a = uint256(keccak256(abi.encodePacked(_seed)));
		_A = BigMod.bigMod(G, _a, P);
	}

	function transmitA(SmartDiffieHellman _other, uint256 _A) public {
		require(address(_other) != address(0), "Other SmartDiffieHellman contract unassigned.");
		require(P == _other.P(), "Prime is different.");
		require(G == _other.G(), "Root is different.");

		_other.setB(_A);
	}


	function generateAExtB(uint256 _a, uint256 _B) public view returns (uint256 _AB) {
		_AB = BigMod.bigMod(_B, _a, P);
	}

	function generateAB(uint256 _a) public view returns (uint256 _AB) {
		require(address(other) != address(0), "Other SmartDiffieHellman contract unassigned.");
		require(B != 0, "B has not been transmitted by other SmartDiffieHellman.");

		_AB = BigMod.bigMod(B, _a, P);
	}

	function setB(uint256 _B) public {
		other = msg.sender;
		B = _B;
	}

	function stop() public {
		selfdestruct(msg.sender);
	}
}