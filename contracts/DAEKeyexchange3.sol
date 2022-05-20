// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.7.0;

contract DAEKeyexchange3 {
    
    uint public versionNum ; //Protocol DAEK5
    uint exp =500;
    address public owner;
    constructor(uint vnum) {
        /*
        50000 for Protocol DAEK5 with N=160 and L =1024 
        50001 for Protocol DAEK5 with N=224 and L =2048 
        50010 for Protocol DAEK5 with N=256 and L =2048 
        50011 for Protocol DAEK5 with N=256 and L =3072 
        */
        versionNum = vnum;
        owner = msg.sender;
    }

    struct User {
        address user;
        string PK;
        string ID;
        uint timestamp;
        string token1;
        string token2;
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

    function setStrforCommunicator(address iUser, string calldata str, uint strtype) external {
        require(users[iUser].user == msg.sender);
        if(100 == strtype) users[iUser].token1 = str;
        if(200 == strtype) users[iUser].token2= str;
        if(300 == strtype) users[iUser].c = str;
    }

    function getStrfromCommunicator(address iUser, uint strtype) external view returns (string memory){
        if(100 == strtype) return users[iUser].token1;
        if(200 == strtype) return users[iUser].token2;
        if(300 == strtype) return users[iUser].c;
    }





    
   
  

}