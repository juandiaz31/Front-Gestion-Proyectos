import { gql } from "@apollo/client";

const GET_USUARIOS = gql`
  query Usuarios($filtro: filtroUsuarios) {
    Usuarios(filtro: $filtro) {
      _id
      nombre
      apellido
      correo
      estado
      identificacion
      rol
    }
  }
`;

const GET_ESTUDIANTES = gql`
  query Estudiantes {
    Estudiantes {
      _id
      nombre
      apellido
      correo
      identificacion
      rol
      estado
    }
  }
`;

const GET_USUARIO = gql`
  query Usuario($_id: String!) {
    Usuario(_id: $_id) {
      _id
      nombre
      apellido
      correo
      estado
      identificacion
      rol
    }
  }
`;

const GET_PERFIL_USUARIO = gql`
  query PerfilUsuario($id: String!) {
    PerfilUsuario(_id: $id) {
      _id
      nombre
      apellido
      identificacion
      correo
    }
  }
`;

const GET_LIDERES = gql`
  query Lideres {
    Lideres {
      _id
      nombre
      apellido
    }
  }
`;
export {
  GET_USUARIOS,
  GET_USUARIO,
  GET_ESTUDIANTES,
  GET_PERFIL_USUARIO,
  GET_LIDERES,
};
