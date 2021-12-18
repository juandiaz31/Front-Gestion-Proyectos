import { gql } from "@apollo/client";

const GET_PROYECTOS = gql`
  query Proyectos {
    Proyectos {
      _id
      nombre
      estado
      presupuesto
      fechaInicio
      fechaFin
      fase
      objetivos {
        _id
        descripcion
        tipo
      }
      lider {
        _id
        identificacion
        nombre
        apellido
      }
      inscripciones {
        estado
        estudiante {
          _id
        }
      }
    }
  }
`;

export { GET_PROYECTOS };
