import React,{Component} from 'react';


class Register extends Component{
  constructor(props){
      super(props);
      this.state = {
        registerName:'',
        registerEmail:'',
        registerPassword:''
      }
  }

  onNameChange=(event)=>{
    this.setState({registerName:event.target.value});
  }

  onEmailChange=(event)=>{
    this.setState({registerEmail:event.target.value})
  }

  onPasswordChange=(event)=>{
    this.setState({registerPassword:event.target.value})
  }

  onSubmitRegister=()=>{
    fetch('http://localhost:4000/register',{
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
        name:this.state.registerName,
        email: this.state.registerEmail,
        password: this.state.registerPassword
        })
    })
    .then(response => response.json())
    .then(user=>{
        if(user){
            this.props.loadUser(user);
            this.props.onRouteChange('home');
        }
    })
  }

  render(){
    return(
      <article className="br3 ba dark-gray b--white-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 white-80">
          <form className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0 white" >Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6 white" htmlFor="email-address">Name</label>
                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                       type="text" 
                       name="Name"  
                       id="Name"
                       onChange={this.onNameChange}
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6 white" htmlFor="email-address">Email</label>
                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                           type="email" 
                           name="email-address" 
                           id="email-address" 
                           onChange={this.onEmailChange}
                    />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6 white" htmlFor="password">Password</label>
                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                       type="password" 
                       name="password"  
                       id="password"
                       onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input className="white b ph3 pv2 input-reset ba b--white bg-transparent grow pointer f6 dib" 
                     type="button" 
                     value="Register"
                     onClick={this.onSubmitRegister}
                     />
            </div>
          </form>
        </main>
    </article>
    )
  }
}

export default Register;