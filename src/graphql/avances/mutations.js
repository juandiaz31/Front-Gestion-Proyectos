import { gql } from "@apollo/client";

const CREAR_AVANCE = gql`
  mutation CrearAvance(
    $fecha: Date!
    $descripcion: String!
    $proyecto: String!
    $creadoPor: String!
  ) {
    crearAvance(
      fecha: $fecha
      descripcion: $descripcion
      proyecto: $proyecto
      creadoPor: $creadoPor
    ) {
      _id
    }
  }
`;

const CREAR_OBSERVACION = gql`
  mutation CrearObservacion($_id: String!, $observacion: String!) {
    crearObservacion(_id: $_id, observacion: $observacion) {
      _id
      observaciones
    }
  }
`;

const EDITAR_AVANCE = gql`
  mutation EditarAvance($_id: String!, $descripcion: String!) {
    editarAvance(_id: $_id, descripcion: $descripcion) {
      _id
      descripcion
    }
  }
`;
export { CREAR_AVANCE, CREAR_OBSERVACION, EDITAR_AVANCE };
