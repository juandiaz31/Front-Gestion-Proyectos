import { gql } from "@apollo/client";

const GET_INSCRIPCIONES = gql`
  query Inscripciones {
    Inscripciones {
      _id
      estado
      fechaIngreso
      proyecto {
        _id
        nombre
        lider {
          _id
        }
      }
      estudiante {
        _id
        correo
        nombre
        apellido
      }
    }
  }
`;

export { GET_INSCRIPCIONES };
