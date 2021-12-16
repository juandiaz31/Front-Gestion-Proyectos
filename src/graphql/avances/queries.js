import { gql } from "@apollo/client";

const GET_AVANCES = gql`
  query Avances($project: String) {
    Avances(project: $project) {
      _id
      descripcion
      fecha
      observaciones
      proyecto {
        nombre
      }
    }
  }
`;

const FILTRAR_AVANCES = gql`
  query FiltrarAvance($id: String!) {
    filtrarAvance(_id: $id) {
      _id
      descripcion
      fecha
      observaciones
      proyecto {
        nombre
      }
    }
  }
`;
export { GET_AVANCES, FILTRAR_AVANCES };
