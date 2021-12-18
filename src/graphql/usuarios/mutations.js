import { gql } from "@apollo/client";

const EDITAR_USUARIO = gql`
  mutation EditarUsuario(
    $_id: String!
    $nombre: String!
    $apellido: String!
    $identificacion: String!
    $correo: String!
  ) {
    editarUsuario(
      _id: $_id
      nombre: $nombre
      apellido: $apellido
      identificacion: $identificacion
      correo: $correo
    ) {
      _id
      nombre
      apellido
      correo
      estado
      identificacion
    }
  }
`;

const EDITAR_PERFIL = gql`
  mutation EditarPerfil($_id: String!, $campos: CamposEditarPerfil!) {
    editarPerfil(_id: $_id, campos: $campos) {
      _id
      nombre
      apellido
      identificacion
      correo
    }
  }
`;

export { EDITAR_USUARIO, EDITAR_PERFIL };
