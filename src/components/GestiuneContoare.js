import React, { Component } from 'react';
import styled from 'styled-components';
import {db} from './FirebaseConfig';

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
        isAdmin: props.isAdmin || false
      }
    }
  
    componentDidUpdate(prevProps) {
      if (this.props.isAdmin !== prevProps.isAdmin) {
        this.setState({...this.state, isAdmin: this.props.isAdmin});
      }
    }

    render() {
        return (
        <div>
          <GridWrapper>
            <h2>Gestiune Controare</h2>
            <p>Buna ziua,</p>
            <p>Mai jos regasiti tabelul cu contoarele</p>
            {this.state.isAdmin ? <p>suntADMIN </p>: <p>nu sunt admin</p>}
          </GridWrapper>
        </div>
        );
      }
    }


export default GestiuneContoare;