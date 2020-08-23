import React, { Component } from 'react';
import {fire} from './FirebaseConfig';

class Logout extends Component {

    logout(evt) {
        evt.preventDefault();
        fire.auth().signOut();
        localStorage.removeItem('user');
    }
    
    render() {
        return <p  onClick={this.logout}>Logout</p>;
    };   
};

export default Logout;