import React, { Component } from 'react';
import { db } from './FirebaseConfig';
import { create } from './FirebaseConfig';

async function __addUser(uid, firstName, lastName, asociatie) {
  const docRef = db.collection('locatari').doc(uid);
  await docRef.set({
    nume: firstName,
    prenume: lastName,
    id_asociatie: asociatie
  });
  window.location.reload(false);
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
      asociatie: '',
      asociatieIDFiltruSelectata: '',
      locatari: [],
      open: false,
      asociatii: []
    }
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

  onAsociatieRegisterSelected = (e) => {
    let { value } = e.target;
    this.setState({
      asociatie: value,
    });
  }

  onAsociatieFilterrSelected = (e) => {
    let { value } = e.target;
    this.setState({
      asociatieIDFiltruSelectata: value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    create.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
      __addUser(u.user.uid, this.state.firstName, this.state.lastName, this.state.asociatie);
    }).then((u) => {})
      .catch((error) => {
        console.log(error);
      })
    console.log(this.state);
  }

  onClick = (e) => {
    this.setState({
      open: !this.state.open
    });
  };

  componentDidMount() {
    const component = this;
    (async () => {
      const snapshot = await db.collection('asociatii').get();
      let asociatii = snapshot.docs.map((doc) => {
        return {
          _id: doc.id,
          ...doc.data()
        }
      });

      component.setState(Object.assign({}, component.state, { asociatii }, { asociatie: asociatii[0]._id, asociatieIDFiltruSelectata: asociatii[0]._id }));
    })();

    (async () => {
      const snapshot = await db.collection('locatari').get();
      let locatari = snapshot.docs.map((doc) => {
        return {
          _id: doc.id,
          ...doc.data()
        }
      });

      component.setState(Object.assign({}, component.state, { locatari }));
    })();

  }

  render() {
    const { asociatii, locatari } = this.state;
    console.log("GestionarePersoane -> render -> locatari", locatari);

    const asociatiiSelect = (
      <select name="asociatie" id="asociatieSelect" onChange={this.onAsociatieRegisterSelected}>
        {asociatii.map(({ adresa, _id }) => {
          return <option key={adresa} value={_id}>{adresa}</option>
        })}
      </select>
    );

    const filtrareAsociatieSelect = (
      <select name="asociatie" id="asociatieSelect" onChange={this.onAsociatieFilterrSelected}>
        {asociatii.map(({ adresa, _id }) => {
          return <option key={adresa} value={_id}>{adresa}</option>
        })}
      </select>
    );

    const tablelLocatari = (
      <table>
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Numar apartament</th>
            <th>Suprafata mp</th>
            <th>Asociatie</th>
          </tr>
        </thead>
        <tbody>
          {locatari.map((data) => {
            let numeAsociatie = asociatii.find((dataAsociatie) => {
              return dataAsociatie._id === data.id_asociatie;
            });

            if (data.id_asociatie !== this.state.asociatieIDFiltruSelectata) {
              return null;
            }

            numeAsociatie = numeAsociatie && numeAsociatie.adresa;
            return (
              <tr key={data._id}>
                <td>{data.nume || "-"}</td>
                <td>{data.prenume || "-"}</td>
                <td>{data.nr_apartament || "-"}</td>
                <td>{data.suprafata_mp || "-"}</td>
                <td>{numeAsociatie || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );

    return this.state.isAdmin ? (
      <div className="add-person">
        {/* <Button className="btn" onClick={this.onClick}>
          Collapse Div
           </Button>
        <Collapse in={this.state.open}> */}
        <div>
          <form id="registration-form" className="white" onSubmit={this.handleSubmit}>
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
              <label htmlFor="asociatie">Asociatie</label>
              {asociatiiSelect}
            </div>
            <div className="input-field">
              <button className="btn btn-primary center">Inregistrare</button>
            </div>
          </form>
        </div>
        {/* </Collapse> */}
        <div className="input-field">
          <label htmlFor="asociatie">Asociatie filtru</label>
          {filtrareAsociatieSelect}
        </div>
        {tablelLocatari}
      </div>
    )
      :
      // TODO: replace with 404 page 
      <div>
      </div>;
  }
}


export default GestionarePersoane;