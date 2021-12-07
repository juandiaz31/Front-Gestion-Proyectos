import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import PrivateRoute from "components/PrivateRoute";
import { GET_INSCRIPCIONES } from "graphql/inscripciones/queries";
import { APROBAR_INSCRIPCION } from "graphql/inscripciones/mutations";
import ButtonLoading from "components/ButtonLoading";
import { toast } from "react-toastify";



const IndexInscripciones = () => {
  const { data, loading, error } = useQuery(GET_INSCRIPCIONES);

  if (loading) return <div>...Loading</div>;

  return (
    <PrivateRoute roleList={["ADMINISTRADOR", "LIDER"]}>
      <div className="p-10 flex flex-col items-center">
        <h1 className="text-gray-900 text-xl font-bold uppercase">
          Inscripciones
        </h1>
        <table className="tabla">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Estudiante</th>
              <th>Estado</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.Inscripciones.map((inscripcion) => {
                return <Inscripcion inscripcion={inscripcion} />;
              })}
          </tbody>
        </table>
      </div>
    </PrivateRoute>
  );
};

const Inscripcion = ({ inscripcion }) => {
  const [aprobarInscripcion, { data, loading, error }] =
    useMutation(APROBAR_INSCRIPCION);

  useEffect(() => {
    if (data) {
      toast.success("Inscripcion aprobada con exito");
    }
  }, [data]);

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

  return (
    <>
      <tr>
        <td>{inscripcion.proyecto.nombre}</td>
        <td>
          {inscripcion.estudiante.nombre} {inscripcion.estudiante.apellido}
        </td>
        <td>{inscripcion.estado}</td>
        <td>
          {inscripcion.estado === "PENDIENTE" && (
            <ButtonLoading
              onClick={() => {
                cambiarEstadoInscripcion();
              }}
              text="Aprobar"
              loading={loading}
              disabled={false}
            />
          )}
        </td>
      </tr>
    </>
  );
};
export default IndexInscripciones;
