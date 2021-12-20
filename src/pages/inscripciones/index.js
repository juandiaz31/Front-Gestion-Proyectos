import React, { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import PrivateRoute from "components/PrivateRoute";
import { GET_INSCRIPCIONES } from "graphql/inscripciones/queries";
import { APROBAR_INSCRIPCION } from "graphql/inscripciones/mutations";
import ButtonLoading from "components/ButtonLoading";
import { toast } from "react-toastify";

import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from "components/Accordion";
import { RECHAZAR_INSCRIPCION } from "graphql/inscripciones/mutations";
import { useUser } from "context/userContext";

const IndexInscripciones = () => {
  //falta captar el error del query
  const { data, loading, refetch } = useQuery(GET_INSCRIPCIONES);

  if (loading) return <div>...Loading</div>;

  return (
    <PrivateRoute roleList={["ADMINISTRADOR", "LIDER"]}>
      <div className="p-10 flex flex-col items-justify ">
        <h1 className="text-gray-900 text-xl font-bold uppercase my-5">
          Inscripciones
        </h1>

        <AccordionInscripcion
          titulo="Inscripciones aprobadas"
          data={data.Inscripciones.filter((el) => el.estado === "ACEPTADO")}
        />
        <AccordionInscripcion
          titulo="Inscripciones pendientes"
          data={data.Inscripciones.filter((el) => el.estado === "PENDIENTE")}
          refetch={refetch}
        />
        <AccordionInscripcion
          titulo="Inscripciones rechazadas"
          data={data.Inscripciones.filter((el) => el.estado === "RECHAZADO")}
        />
      </div>
    </PrivateRoute>
  );
};

const AccordionInscripcion = ({ data, titulo, refetch = () => {} }) => {
  return (
    <AccordionStyled>
      <AccordionSummaryStyled>{titulo}</AccordionSummaryStyled>
      <AccordionDetailsStyled>
        <div className="w-full">
          <table className="tabla">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Estudiante</th>
                <th>Estado</th>
                <th>Accion</th>
                <th>Fecha de Ingreso</th>
                <th>Fecha de Egreso</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((inscripcion) => {
                  return (
                    <Inscripcion inscripcion={inscripcion} refetch={refetch} />
                  );
                })}
            </tbody>
          </table>
        </div>
      </AccordionDetailsStyled>
    </AccordionStyled>
  );
};

const Inscripcion = ({ inscripcion, refetch }) => {
  const { userData } = useUser();
  console.log("user id", userData._id);
  console.log("inscripcion lider id", inscripcion.proyecto.lider._id);

  const [aprobarInscripcion, { data, loading, error }] =
    useMutation(APROBAR_INSCRIPCION);

  const [
    rechazarInscripcion,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(RECHAZAR_INSCRIPCION);

  useEffect(() => {
    if (data) {
      toast.success("Inscripcion aprobada con exito");
      refetch();
    }
  }, [data, refetch]);

  useEffect(() => {
    if (error) {
      toast.error("Error aprobando la inscripcion");
    }
  }, [error]);

  const cambiarEstadoInscripcion = () => {
    aprobarInscripcion({
      variables: {
        aprobarInscripcionId: inscripcion._id,
      },
    });
  };

  const noAprobarInscripcion = () => {
    rechazarInscripcion({
      variables: {
        rechazarInscripcionId: inscripcion._id,
      },
    })
      .then(() => {
        toast.success("Inscripcion rechazada con exito");
      })
      .catch((mutationError) => {
        toast.error("Error rechazando inscripcion");
      });
  };

  if (userData._id === inscripcion.proyecto.lider._id) {
    return (
      <>
        <tr>
          <td>{inscripcion.proyecto.nombre}</td>
          <td>
            {inscripcion.estudiante.nombre} {inscripcion.estudiante.apellido}
          </td>
          <td>{inscripcion.estado}</td>
          <td>
            <div className="flex flex-col">
              {inscripcion.estado === "PENDIENTE" && (
                <ButtonLoading
                  onClick={() => {
                    cambiarEstadoInscripcion();
                  }}
                  text="Aceptar"
                  loading={loading}
                  disabled={false}
                />
              )}
              {inscripcion.estado === "PENDIENTE" && (
                <ButtonLoading
                  onClick={() => {
                    noAprobarInscripcion();
                  }}
                  text="Rechazar"
                  loading={mutationLoading}
                  disabled={false}
                />
              )}
            </div>
          </td>
          <td>{inscripcion.fechaIngreso}</td>
          <td>{inscripcion.fechaEgreso}</td>
        </tr>
      </>
    );
  }

  return <></>;
};
export default IndexInscripciones;
