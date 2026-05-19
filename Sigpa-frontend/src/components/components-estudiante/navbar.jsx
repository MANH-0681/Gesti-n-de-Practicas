import React from 'react';

const Navbar = ({ nombreMostrar }) => {

  return (
    <header className="contenedor-cabecera">

      <div className="bloque-saludo">

        <h1>
          Hola, {nombreMostrar} 👋
        </h1>

        

      </div>

    </header>
  );
};


export default Navbar;
