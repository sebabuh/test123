import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import styled from 'styled-components';
import Logout from './Logout';


const Styles = styled.div`
  .navbar { background-color: var(--lightBlue); }
  a, .navbar-nav, .navbar-light .nav-link {
    &:hover { color: white; }
  }
  .navbar-brand {
    font-size: 1.4em;
    &:hover { color: white; }
  }
  .form-center {
    position: absolute !important;
    left: 25%;
    right: 25%;
  }
`;
export const NavigationBar = (props) => (
  <Styles>
    <Navbar expand="lg">
      <Navbar.Brand href="/">Administratorul On-Line</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href="/IncasariSiPlati">Incasari si Plati</Nav.Link></Nav.Item>
          {/* TODO: Check with Adi*/}
          {props.isAdmin ? <Nav.Item><Nav.Link href="/GestiuneContoare">Gestiune Contoare</Nav.Link></Nav.Item> : null}
          {props.isAdmin ? <Nav.Item><Nav.Link href="/GestionarePersoane">Gestionare Persoane</Nav.Link></Nav.Item> : null}
          <Nav.Item><Nav.Link href="/Fonduri">Fonduri</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href="/Rapoarte">Rapoarte</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href="#"><Logout /></Nav.Link></Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </Styles>
)