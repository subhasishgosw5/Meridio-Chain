import React, { Component } from 'react';
import {Modal,Button, Form} from 'react-bootstrap'
import Loader from 'react-loader-spinner';

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Post
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={(event) => {
                  event.preventDefault()
                  const heading = document.getElementById("postHeading").value
                  const content = document.getElementById("postContent").value
                  props.createPost(heading, content)
                  props.onHide();
                }}>
      <Modal.Body>
        <Form.Group controlId="formBasicText">
          <Form.Control id="postHeading" type="text" className="form-control" placeholder="Title of your project?" required />
        </Form.Group>

        <Form.Group controlId="formBasicText">
          <Form.Control id="postContent" type="text" className="form-control" placeholder="What's on your mind?" required />
        </Form.Group>
      
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" type="submit">
          Post
        </Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
      </Form>
    </Modal>
  );
}


class Main extends Component {

  state={
    modalShow:false,
    userData:[],
    loading:true,
    posts:[]
  }

  setModalShow(flag){
    this.setState({modalShow:flag});
  }

  matchedAddress(address,data){
    let flag=false;
    data.map(item=>{
      if(item.address===address){
        console.log("True!",item)
        flag=item;
      }
      return 0;
    });
    return(flag);
  }
  componentDidMount(){
    let data=this.props.allUserData;
    let posts=this.props.posts;
    let user = this.props.user;
    this.setState({userData:data});
    console.log("data: ",user);

    posts.map(item=>{
      let obj=this.matchedAddress(item.author,data);
      console.log("Returned Object",obj);
      if(obj!==false){
          item.email=obj.email;
          item.name=obj.name;
          item.image=obj.image;
          item.tagline=obj.tagline;
      }else{
          item.email='';
          item.name='';
          item.image='';
          item.tagline='';
      }
      return 0;
    });
    console.log(posts)
    this.setState({posts:posts,loading:false});
  }
  
  

  render() {
    return (
      <div className="container-fluid mt-5">

        <Button variant="primary" id="addPostButton" onClick={() => {
          this.props.checkCompleteProfile();
          this.setModalShow(true);
          }}>
      What's in your mind?
      </Button>

      <MyVerticallyCenteredModal
        show={this.state.modalShow}
        onHide={() => this.setModalShow(false)}
        createPost={this.props.createPost}
        email={this.props.email}
      />
       <div className="row">
        {!this.state.loading?
          <main role="main" className="col-md-12 ml-auto mr-auto" >
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              { this.state.posts.map((post, key) => {
                return(
                  <div className="postcard col-md-9 ml-auto mr-auto" key={key}>
                    <div className="post-header" style={{width:'100%'}}>
                      <img
                        className='mr-2 float-left'
                        width='40'
                        height='40'
                        alt="img should be here"
                        src={post.image}
                      />
                      <div className= "header-data">
                        <p><strong>{post.name}</strong></p>
                        <a href={"mailto:"+post.email}><small className="text-muted">{post.email}</small></a>
                      </div>
                    </div>
                   
                      
                    <hr></hr>
                    <div className="post-body">
                      <h2 className="heading">{post.heading}</h2>
			  		          <p>{post.content}</p>
                      <small className="float-bottom-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                      </small>
                      {
                        ()=>{
                          console.log("user:",this.props.user);
      console.log("author: ",post.author);
                          if(this.props.user !== post.author){
                            return(
                            <button
                              className="btn btn-link btn-sm float-right pt-0"
                              name={post.id}
                              id="support-button"
                              onClick={(event) => {
                                let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                                console.log(event.target.name, tipAmount)
                                this.props.tipPost(event.target.name, tipAmount)
                              }}
                            >
                              TIP 0.1 ETH
                            </button>
                            )
                          }
                        }
                      }
                      
                    </div>
                  </div>
                )
              })
              }
            </div>
          </main>
          :
          <div style={{width:'100%'}} className="align-middle text-center mt-5" id="reactLoader">
          <Loader
              type="Grid"
              color="#29487D"
              height={80}
              width={80}
          />
          </div>
          
          }

        </div>
      </div>
    );
  }
}

export default Main;
