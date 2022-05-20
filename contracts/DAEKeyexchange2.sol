// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.7.0;

contract DAEKeyexchange2 {
    
    uint public versionNum ; //Protocol DAEK3 
    uint exp =500;
    address public owner;
    constructor(uint vnum) {
        /*
        30000 for Protocol DAEK3 with N=160 and L =1024 
        30001 for Protocol DAEK3 with N=224 and L =2048 
        30010 for Protocol DAEK3 with N=256 and L =2048 
        30011 for Protocol DAEK3 with N=256 and L =3072 
        */
        versionNum = vnum;
        owner = msg.sender;
    }

    struct User {
        address user;
        string PK;
        string ID;
        uint timestamp;
        string c;
    }

    mapping(address => User) users;

    function Initialization(address iUser, string calldata iID, string calldata iPK) external {
        require(msg.sender == owner && users[iUser].user == address(0));
        users[iUser].user = iUser;
        users[iUser].PK = iPK;
        users[iUser].ID = iID;
        users[iUser].timestamp = block.number;
    }

   
    function getIdBasic(address iUser) external view returns (address,  string memory, string memory){
        require(users[iUser].user != address(0) && (block.number - users[iUser].timestamp) < exp);
        return (users[iUser].user,users[iUser].PK,users[iUser].ID);
    }

    function updateCert(address iUser, string calldata iPK) external {
        require(msg.sender == users[iUser].user && (block.number - users[iUser].timestamp) > exp);
        users[iUser].PK = iPK;
    }

    function setStrforCommunicator(address iUser, string calldata str) external {
        require(users[iUser].user == msg.sender);
        users[iUser].c = str;
    }

    function getStrfromCommunicator(address iUser) external view returns (string memory){
        return users[iUser].c;
    }





    
   
  

}