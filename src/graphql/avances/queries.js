import { gql } from "@apollo/client";

const GET_AVANCES = gql`
  query Avances($project: String) {
    Avances(project: $project) {
      _id
      descripcion
      fecha
      observaciones
      creadoPor {
        _id
        nombre
        apellido
      }
      proyecto {
        nombre
        lider {
          nombre
          apellido
          _id
        }
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
      creadoPor {
        nombre
        apellido
      }
      observaciones
      proyecto {
        nombre
      }
    }
  }
`;
export { GET_AVANCES, FILTRAR_AVANCES };
