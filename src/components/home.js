import React, { Component } from 'react';
import styled from 'styled-components';
import {fire} from './FirebaseConfig';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import  IncasariSiPlati  from "./IncasariSiPlati";
import 'bootstrap/dist/css/bootstrap.min.css';

const GridWrapper = styled.div`
  grid-gap: 10px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 6em;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(25px, auto);
`;


class Home extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      isAdmin: props.isAdmin
    }
  }


  logout() {
    console.log("test")
    fire.auth().signOut();
  }



  render() {

    return (

      <div className='col-ms-6'>
        <GridWrapper>
          <p>Bine ati revenit la noi</p>
          <p></p>
        </GridWrapper>
        <React.Fragment>
          <Router>
          <Switch>
                <Route exact path="/incasarisiplati" render={(props) => (<IncasariSiPlati isAdmin={this.state.isAdmin}/>) } />
           </Switch>
           </Router>
        </React.Fragment>

        

      </div>


    );
  }
}


export default Home;