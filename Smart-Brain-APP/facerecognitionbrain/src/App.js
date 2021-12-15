import React,{Component} from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './Componnent/Navigation/Navigation';
import Logo from './Componnent/Logo/Logo';
import ImageLinkForm from './Componnent/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Componnent/FaceRecognition/FaceRecognition';
import Rank from './Componnent/Rank/Rank';
import SignIn from './Componnent/SignIn/SignIn';
import Register from './Componnent/Register/Register';
import Particles from 'react-particles-js';


const app = new Clarifai.App({
 apiKey: '10c9bba0088e438da364be3b85148655'
});

const particlesOptions = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn: false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }
}

class App extends Component {
  constructor() {
    super();
    this.state=initialState
  }

  onInputChange=(event)=>{
    this.setState({input:event.target.value});
  }

  calculateFaceLocation=(data)=>{
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputImage');
    const width= Number(image.width);
    const height= Number(image.height);
    return{
      leftCol:clarifaiFace.left_col*width,
      rightCol:width-(clarifaiFace.right_col*width),
      topRow:clarifaiFace.top_row*height,
      bottomRow:height-(clarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox=(box)=>{
    this.setState({box:box});
  }

  // a403429f2ddf4b49b307e318f00e528b
  onPictureSubmit=()=>{
    this.setState({imageUrl:this.state.input})
    app.models.predict("f76196b43bbd45c99b4f3cd8e8b40a8a",`${this.state.input}`)
    .then(response =>{
      if(response){
        fetch('http://localhost:4000/image',{
          method: 'put',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
              id:this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user,{entries:count}))})
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(error=>{console.log(error)});
  }

  onRouteChange=(route)=>{
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  loadUser=(userData)=>{
    this.setState({user:{
      id:userData.id,
      name:userData.name,
      email:userData.email,
      entries:userData.entries,
      joined:userData.joined
    }});
  }
  
  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles 
        className='particles' 
        params={particlesOptions} 
        />
        <Navigation 
          isSignedIn={isSignedIn} 
          onRouteChange={this.onRouteChange} 
        />
        { route === 'home'?
          <div>
              <Logo />
              <Rank 
                name={this.state.user.name} 
                rank={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onPictureSubmit={this.onPictureSubmit}
              />
              <FaceRecognition 
                box={box} 
                imageUrl={imageUrl} 
              />
          </div>: (route === 'signin'?
           <SignIn 
            loadUser={this.loadUser} 
            onRouteChange={this.onRouteChange} 
           />:(route === 'signout'?
            <SignIn 
              loadUser={this.loadUser} 
              onRouteChange={this.onRouteChange} 
            />:<Register 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange}
            />))
        }
      </div>
    );
  }
}
export default App;
