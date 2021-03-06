pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint public postCount = 0;
    mapping(uint => Post) public posts;
    mapping (address => mapping (uint => Post) ) public user_post;
    mapping(address => uint) public user_post_count;

    struct Post {
        uint id;
        string heading;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostCreated(
        uint id,
        string heading,
        string content,
        uint tipAmount,
        address payable author
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    constructor() public {
        name = "Meridio Chain";
    }

    function createPost(string memory _heading, string memory _content) public {
        // Require valid content
        require(bytes(_content).length > 0);
        // Increment the post count
        postCount ++;
        // Create the post
        posts[postCount] = Post(postCount, _heading, _content,  0, msg.sender);
        user_post_count[msg.sender] ++;
        user_post[msg.sender][user_post_count[msg.sender]] = Post(postCount, _heading, _content,  0, msg.sender);
        // Trigger event
        emit PostCreated(postCount, _heading, _content,  0, msg.sender);
    }

    function tipPost(uint _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount);
        // Fetch the post
        Post memory _post = posts[_id];
        // Fetch the author
        address payable _author = _post.author;
        // Pay the author by sending them Ether
        address(_author).transfer(msg.value);
        // Incremet the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update the post
        posts[_id] = _post;
        // Trigger an event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }

    
}
