import React, { Component } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import styled from 'styled-components';
import { db } from './FirebaseConfig';
import { create } from './FirebaseConfig';

const GridWrapper = styled.div`
  grid-gap: 10px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 6em;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(25px, auto);
`;

async function __addUser(uid, firstName, lastName) {
  const docRef = db.collection('locatari').doc(uid);
  await docRef.set({
    nume: firstName,
    prenume: lastName,
  });
};

class GestionarePersoane extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      isAdmin: props.isAdmin || false,
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      open: false
    }
    db.collection('locatari').get();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isAdmin !== prevProps.isAdmin) {
      this.setState({ ...this.state, isAdmin: this.props.isAdmin });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    create.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
      __addUser(u.user.uid, this.state.firstName, this.state.lastName);
    }).then((u) => { })
      .catch((error) => {
        console.log(error);
      })
    console.log(this.state);
  }

  onClick = (e) => {
    this.state.open = !this.state.open;
  };

  render() {
    return this.state.isAdmin ? (
      <div className="add-person">
        {/* <Button className="btn" onClick={this.onClick}>
          Collapse Div
           </Button>
        <Collapse in={this.state.open}> */}
          <div>
            <form className="white" onSubmit={this.handleSubmit}>
              <h5 className="grey-text text-darken-3">Inregistrare persoana</h5>
              <div className="input-field">
                <label htmlFor="email">Email</label>
                <input type="email" id='email' onChange={this.handleChange} />
              </div>
              <div className="input-field">
                <label htmlFor="password">Parola</label>
                <input type="password" id='password' onChange={this.handleChange} />
              </div>
              <div className="input-field">
                <label htmlFor="firstName">Nume</label>
                <input type="text" id='firstName' onChange={this.handleChange} />
              </div>
              <div className="input-field">
                <label htmlFor="lastName">Prenume</label>
                <input type="text" id='lastName' onChange={this.handleChange} />
              </div>
              <div className="input-field">
                <button className="btn btn-primary center">Inregistrare</button>
              </div>
            </form>
          </div>
        {/* </Collapse> */}
      </div>
    )
      :
      // TODO: replace with 404 page 
      <div>
      </div>;
  }
}


export default GestionarePersoane;