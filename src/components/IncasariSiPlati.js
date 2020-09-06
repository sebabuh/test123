import React, { Component } from 'react';
import styled from 'styled-components';
import { db } from './FirebaseConfig';
import Editable from 'react-x-editable';

const GridWrapper = styled.div`
  grid-gap: 15px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 6em;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(25px, auto);
`;

class IncasariSiPlati extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      isAdmin: props.isAdmin || false,
      asociatii: [],
      locatari: [],
      locatar: [],
      asociatieIDFiltruSelectata: ''
    }
  }

  onAsociatieFilterrSelected = (e) => {
    let { value } = e.target;
    this.setState({
      asociatieIDFiltruSelectata: value,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.isAdmin !== prevProps.isAdmin) {
      this.setState({ ...this.state, isAdmin: this.props.isAdmin });
    }
  }

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
      const incasariSnapshot = await db.collection('incasari').get();

      let incasari = {};
      incasariSnapshot.docs.forEach((doc) => {
        incasari[doc.id] = doc.data();
      });

      let locatari = snapshot.docs.map((doc) => {
        let total = 0;
        if (doc.id in incasari) {
          total = incasari[doc.id].total;
        }
        return {
          _id: doc.id,
          ...doc.data(),
          total: total
        }
      });

      component.setState(Object.assign({}, component.state, { locatari }));
    })();

    (async () => {
      const snapshot = await db.collection('locatari').doc(this.state.user.uid).get();
      const incasariSnapshot = await db.collection('incasari').doc(this.state.user.uid).get();


      let locatar = [{
        _id: snapshot.id,
        ...snapshot.data(),
        ...incasariSnapshot.data()
      }]

      component.setState(Object.assign({}, component.state, { locatar }));
    })();
  }

  updateData = (value) => {
    if (value && value.props) {
      const [idToEdit, colToEdit] = value.props.name.split('.');
      const newValue = value.newValue;
      (async () => {
        var updateJSON = {};
        updateJSON[colToEdit] = newValue;
        var docRef = await db.collection("incasari").doc(idToEdit);
        docRef.get().then(function (foundDoc) {
          if (foundDoc.exists) {
            docRef.update(updateJSON)
          } else {
            docRef.set(updateJSON);
          }
        });
      })();
    }
  }

  render() {
    const { asociatii, locatari, locatar } = this.state;
    const tableIncasari = (
      <table>
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Total Plata</th>
          </tr>
        </thead>
        <tbody>
          {this.state.isAdmin ? locatari.map((data) => {
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
                <td><Editable
                  name={data._id + ".total"}
                  dataType="text"
                  mode="inline"
                  value={data.total || "-"}
                  showButtons={false}
                  handleSubmit={this.updateData} />
                </td>
              </tr>
            );
          }) :
          locatar.map((data) => {
            return (
              <tr key={data._id}>
                <td>{data.nume || "-"}</td>
                <td>{data.prenume || "-"}</td>
                <td>{data.total || "-"}</td>
              </tr>
            );
          })
          }
        </tbody>
      </table>
    );

    if (!this.state.isAdmin) {
      return (
        <div>
          <GridWrapper>
            <h2>Incasari si Plati</h2>
            <p>Buna ziua,</p>
            <p>Mai jos regasiti cheltuielile dumneavoastra</p>
            {tableIncasari}
          </GridWrapper>
        </div>
      )
    }

    const filtrareAsociatieSelect = (
      <select name="asociatie" id="asociatieSelect" onChange={this.onAsociatieFilterrSelected}>
        {asociatii.map(({ adresa, _id }) => {
          return <option key={adresa} value={_id}>{adresa}</option>
        })}
      </select>
    );

    const continutPagina = (
      <div>
        <p>Mai jos regasiti tabelul cu cheltuielile per asociatie</p>
        <div className="input-field">
          <label htmlFor="asociatie">Asociatie</label>
          {filtrareAsociatieSelect}
        </div>
        {tableIncasari}
      </div>
    );

    return (
      <div>
        <GridWrapper>
          <h2>Incasari si Plati</h2>
          <p>Buna ziua,</p>
          {continutPagina}
        </GridWrapper>
      </div>
    );
  }
}


export default IncasariSiPlati;
