import React, {Component} from 'react';
import {fire } from './FirebaseConfig';

class Login extends Component{
    constructor(props){
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            email: '',
            password:''
        };
    }

    handleChange(e){
        this.setState({[e.target.name]: e.target.value });
    }

    login(e){
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
            console.log(error);
        }); 
    }

    render() {
        return (
                 <form className="text">
                    <h1 className = "text-center">Administratorul  On-Line </h1>
                    <h2 className = "text-center">Va rugam sa va autentigicati cu contul dumneavoastra</h2>
                    <div class="loginForm">
                        <label for="exampleInputEmail1">Email address</label>
                        <input value={this.state.email} onChange={this.handleChange} type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                    </div>
                    <div class="loginForm">
                        <label for="exampleInputPassword1">Password</label>
                        <input value={this.state.password} onChange={this.handleChange} type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                    </div>
                    <div class="loginForm">
                    <button type="submit" onClick={this.login} class="btn btn-primary">Login</button>
                    </div>
                </form>
        );
      }
}

export default Login;