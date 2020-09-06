import React, { Component } from 'react';
import styled from 'styled-components';
import { db } from './FirebaseConfig';
import Editable from 'react-x-editable';  

const GridWrapper = styled.div`
  grid-gap: 10px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 6em;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(25px, auto);
`;


class GestiuneContoare extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      firstName: '',
      lastName: '',
      isAdmin: props.isAdmin || false,
      asociatii: [],
      locatari: [],
      asociatieIDFiltruSelectata: ''
    }
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
      const contoareSnapshot = await db.collection('contoare').get();

      let contoare = {};
      contoareSnapshot.docs.forEach((doc) => {
        contoare[doc.id] = doc.data();
      });
      let locatari = snapshot.docs.map((doc) => {
        let consumption = 0;
        if (doc.id in contoare) {
          consumption = contoare[doc.id].total;
        }
        return {
          _id: doc.id,
          ...doc.data(),
          consumption: consumption
        }
      });

      component.setState(Object.assign({}, component.state, { locatari }));
    })();
  }

  updateData = (value) => {
    if (value && value.props) {
      const [idToEdit, colToEdit] = value.props.name.split('.');
      const newValue = value.newValue;
      (async () => {
        var updateJSON = {};
        updateJSON[colToEdit] = newValue;
        var docRef = await db.collection("contoare").doc(idToEdit);
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
    const { asociatii, locatari } = this.state;

    const filtrareAsociatieSelect = (
      <select name="asociatie" id="asociatieSelect" onChange={this.onAsociatieFilterrSelected}>
        {asociatii.map(({ adresa, _id }) => {
          return <option key={adresa} value={_id}>{adresa}</option>
        })}
      </select>
    );

    const tablelContoare = (
      <table>
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Consum</th>
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
                <td><Editable 
                  name={data._id + ".total"} 
                  dataType="text" 
                  mode="inline" 
                  value={data.consumption || "-"}
                  showButtons={false}
                  handleSubmit={this.updateData}/>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );

    return (
      <div>
        <GridWrapper>
          <h2>Gestiune Controare</h2>
          <p>Buna ziua,</p>
          <p>Mai jos regasiti tabelul cu contoarele per asociatie</p>
          <div className="input-field">
            <label htmlFor="asociatie">Asociatie</label>
            {filtrareAsociatieSelect}
          </div>
          {tablelContoare}
        </GridWrapper>
      </div>
    );
  }
}


export default GestiuneContoare;