import React, { useState, useEffect } from "react";
import PrivateLayout from "layouts/PrivateLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "context/userContext";
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import Index from "pages/Index";

import IndexUsuarios from "pages/usuarios";
import EditarUsuario from "pages/usuarios/editar";
import "styles/globals.css";
import "styles/tabla.css";
import AuthLayout from "layouts/AuthLayout";
import Register from "pages/auth/register";
import Login from "pages/auth/login";
import { AuthContext } from "context/authContext";
import { setContext } from "@apollo/client/link/context";
import jwt_decode from "jwt-decode";
import IndexProyectos from "pages/proyectos/IndexProyectos";
import CrearProyecto from "pages/proyectos/CrearProyecto";
import IndexInscripciones from "pages/inscripciones";
import IndexProfile from "pages/Perfil/IndexProfile";
import IndexAvances from "pages/avances";

// import PrivateRoute from 'components/PrivateRoute';

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JSON.parse(localStorage.getItem("token"));
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

function App() {
  const [userData, setUserData] = useState({});
  const [authToken, setAuthToken] = useState("");

  const setToken = (token) => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
    } else {
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    // console.log("token", authToken);
    // console.log("token decodificado", jwt_decode(authToken));
    if (authToken) {
      const decodedToken = jwt_decode(authToken);
      setUserData({
        _id: decodedToken._id,
        nombre: decodedToken.nombre,
        apellido: decodedToken.apellido,
        identificacion: decodedToken.identificacion,
        correo: decodedToken.correo,
        rol: decodedToken.rol,
      });
    }
  }, [authToken]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ setToken, authToken }}>
        <UserContext.Provider value={{ userData, setUserData }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PrivateLayout />}>
                <Route path="" element={<Index />} />
                <Route path="/usuarios" element={<IndexUsuarios />} />
                <Route
                  path="/usuarios/editar/:_id"
                  element={<EditarUsuario />}
                />
                <Route path="/proyectos" element={<IndexProyectos />} />
                <Route path="/proyectos/crear" element={<CrearProyecto />} />
                <Route path="/inscripciones" element={<IndexInscripciones />} />
                <Route path="/avances/:projectid" element={<IndexAvances />} />
                <Route path="/perfil" element={<IndexProfile />} />
              </Route>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
