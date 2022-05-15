// Lodash, now imported by this script
import _ from 'lodash';
import './style.css';
import beluga from './beluga.jpg';

function component() {
    const element = document.createElement('div');
  
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = beluga;
    element.appendChild(myIcon);
     
    return element;
  }
  
document.body.appendChild(component());