// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.7.0;

contract DAEKeyexchange1 {
    
    uint public versionNum ; //Protocol version
    uint exp =500;
    address public owner;
    constructor(uint vnum) {
        /*
        10000 for Protocol DAEK1 with N=160 and L =1024 
        10001 for Protocol DAEK1 with N=224 and L =2048 
        10010 for Protocol DAEK1 with N=256 and L =2048 
        10011 for Protocol DAEK1 with N=256 and L =3072 
        20000 for Protocol DAEK2 with N=160 and L =1024 
        20001 for Protocol DAEK2 with N=224 and L =2048 
        20010 for Protocol DAEK2 with N=256 and L =2048 
        20011 for Protocol DAEK2 with N=256 and L =3072 
        40000 for Protocol DAEK4 with N=160 and L =1024 
        40001 for Protocol DAEK4 with N=224 and L =2048 
        40010 for Protocol DAEK4 with N=256 and L =2048 
        40011 for Protocol DAEK4 with N=256 and L =3072 
        */
        versionNum = vnum;
        owner = msg.sender;
    }

    struct User {
        address user;
        string PK;
        string ID;
        uint timestamp;
        mapping(address => string) r;
        mapping(address => string) sig;
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

    function setRforCommunicator(address iP, address iQ, string calldata r) external {
        require(users[iP].user == msg.sender);
        users[iP].r[iQ] = r;
    }

    function getRfromCommunicator(address iQ, address iP) external view returns (string memory){
        require(users[iQ].user == msg.sender);
        return users[iP].r[iQ];
    }

     function setSigforCommunicator(address iQ, address iP, string calldata sig) external {
        require(users[iQ].user == msg.sender);
        users[iQ].sig[iP] = sig;
    }

    function getsigfromCommunicator(address iP, address iQ) external view returns (string memory){
        require(users[iP].user == msg.sender);
        return users[iQ].sig[iP];
    }




    
   
  

}