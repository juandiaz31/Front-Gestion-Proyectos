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

const GET_PROYECTO = gql`
  query Proyecto($_id: String!) {
    Proyecto(_id: $_id) {
      _id
      nombre
      presupuesto
    }
  }
`;

export { GET_PROYECTOS, GET_PROYECTO };
