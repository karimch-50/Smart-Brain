import React from 'react';
import './ImageLinkForm.css';


const ImageLinkForm = ({onInputChange,onPictureSubmit}) =>{
    return(
        <div>
            <p className="f3 white">
                {'This Magic Brain will detect faces in your pictures. Give it a try'}
            </p>
            <div className="center">
                <div className="form br3 ba dark-gray b--white-10 center pa4 br3 shadow-5">   
                    <input type="text" className="f4 pa2 w-70 center " onChange={onInputChange}/>
                    <button className="w-30 grow f4 link ph3 pv2 dib black bgButton" onClick={onPictureSubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
} 

export default ImageLinkForm;