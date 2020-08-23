import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './components/Login'
import {fire, db} from './components/FirebaseConfig';
import Home from "./components/home";
import IncasariSiPlati  from "./components/IncasariSiPlati";
import GestiuneContoare from "./components/GestiuneContoare";
import GestionarePersoane from "./components/GestionarePersoane";
import { NavigationBar } from "./components/NavigationBar";


class App extends Component {
  constructor() {
    super();
    this.state = ({
      user: null,
      isAdmin: false,
      isAuthLoading: true
    })
    this.authListener = this.authListener.bind(this);
  }
  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged(async (user) => {
      console.log(user);
      let isAdmin = false
      if (user) {
        this.setState({user, isAuthLoading: false});
        var docRef = db.collection("admins").doc(user.uid);
        isAdmin = await docRef.get().then(function(doc) {
          if (doc.exists) {
              return doc.data().isAdmin;
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
        this.setState({isAdmin: isAdmin, isAuthLoading: false});
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null, isAuthLoading: false });
        localStorage.removeItem('user');
      }
    });
  }

  render() {
    let content=null; 
    console.log(this.state.isAdmin)
    if (this.state.user && !this.state.isAuthLoading){
      content= <React.Fragment>
      <Router>
      <NavigationBar isAdmin={this.state.isAdmin} />
      <Switch>
            <Route exact path="/" component={ Home } user={this.user} />
            <Route exact path="/incasarisiplati" render={(props) => (<IncasariSiPlati user={this.state.user} isAdmin={this.state.isAdmin}/>) } />
            <Route exact path="/GestiuneContoare" render={(props) => (<GestiuneContoare user={this.state.user} isAdmin={this.state.isAdmin}/>) } />
            <Route exact path="/GestionarePersoane" render={(props) => (<GestionarePersoane user={this.state.user} isAdmin={this.state.isAdmin}/>) } />
       </Switch>
       </Router>
    </React.Fragment> 
    }
    if(!this.state.user && !this.state.isAuthLoading){
      content = <Login />;
    }
    return (
      <div className="App">
        {content}
      </div>
    );
  }
}


export default App;
