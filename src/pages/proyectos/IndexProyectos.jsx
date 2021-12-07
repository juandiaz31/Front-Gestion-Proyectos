import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import PrivateComponent from "components/PrivateComponent";
import { Dialog } from "@mui/material";
import DropDown from "components/Dropdown";
import ButtonLoading from "components/ButtonLoading";
import { Enum_EstadoProyecto } from "utils/enum";
import useFormData from "hooks/useFormData";
import { GET_PROYECTOS } from "graphql/proyectos/queries";
import { EDITAR_PROYECTO } from "graphql/proyectos/mutations";
import { CREAR_INSCRIPCION } from "graphql/inscripciones/mutations";
import { useUser } from "context/userContext";
import { toast } from "react-toastify";
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from "components/Accordion";

const IndexProyectos = () => {
  const { data: queryData, loading, error, refetch } = useQuery(GET_PROYECTOS);

  useEffect(() => {
    console.log("datos proyecto", queryData);
    refetch();
  }, [queryData, refetch]);

  if (loading) return <div>Cargando...</div>;

  if (queryData.Proyectos) {
    return (
      <div className="p-10 flex flex-col items-center">
        <h1 className="text-gray-900 text-xl font-bold uppercase">Proyectos</h1>
        <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
          <div className="self-end my-5">
            <button className="bg-gray-500 p-2 rounded-lg shadow-sm text-white hover:bg-gray-400">
              <Link to="/proyectos/crear">Crear nuevo proyecto</Link>
            </button>
          </div>
        </PrivateComponent>
        {queryData.Proyectos.map((proyecto) => {
          return (
            <div className="w-full">
              <AccordionProyecto proyecto={proyecto} />
            </div>
          );
        })}
      </div>
    );
  }

  return <></>;
};

const AccordionProyecto = ({ proyecto }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <AccordionStyled>
        <AccordionSummaryStyled
          expandIcon={<i className="fas fa-chevron-down" />}
        >
          <div className="flex w-full justify-between">
            <div className="uppercase font-bold text-gray-100 ">
              {proyecto.nombre} - {proyecto.estado}
            </div>
          </div>
        </AccordionSummaryStyled>
        <AccordionDetailsStyled>
          <PrivateComponent roleList={["ADMINISTRADOR"]}>
            <i
              className="mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400"
              onClick={() => {
                setShowDialog(true);
              }}
            />
          </PrivateComponent>
          <PrivateComponent roleList={["ESTUDIANTE"]}>
            <InscripcionProyecto
              idProyecto={proyecto._id}
              estado={proyecto.estado}
              inscripciones={proyecto.inscripciones}
            />
          </PrivateComponent>
          <div>
            Liderado Por: {proyecto.lider.nombre} {proyecto.lider.apellido}{" "}
          </div>
          <div className="flex">
            {proyecto.objetivos.map((objetivo) => {
              return (
                <Objetivo
                  tipo={objetivo.tipo}
                  descripcion={objetivo.descripcion}
                />
              );
            })}
          </div>
        </AccordionDetailsStyled>
      </AccordionStyled>
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <FormEditProyecto _id={proyecto._id} />
      </Dialog>
    </>
  );
};

const FormEditProyecto = ({ _id }) => {
  const { form, formData, updateFormData } = useFormData();
  const [editarProyecto, { data: dataMutation, loading, error }] =
    useMutation(EDITAR_PROYECTO);

  const submitForm = (e) => {
    e.preventDefault();
    editarProyecto({
      variables: {
        _id,
        campos: formData,
      },
    });
  };

  useEffect(() => {
    console.log("data mutation", dataMutation);
  }, [dataMutation]);

  return (
    <div className="p-4">
      <h1 className="font-bold">Modificar Estado del Proyecto</h1>
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className="flex flex-col items-center"
      >
        <DropDown
          label="Estado del Proyecto"
          name="estado"
          options={Enum_EstadoProyecto}
        />
        <ButtonLoading disabled={false} loading={loading} text="Confirmar" />
      </form>
    </div>
  );
};

const Objetivo = ({ tipo, descripcion }) => {
  return (
    <div className="mx-5 my-4 bg-yellow-200 p-8 rounded-lg flex flex-col items-center justify-center shadow-xl">
      <div className="text-lg font-bold">{tipo}</div>
      <div>{descripcion}</div>
      <PrivateComponent roleList={["ADMINISTRADOR"]}>
        <div>Editar</div>
      </PrivateComponent>
    </div>
  );
};

const InscripcionProyecto = ({ idProyecto, estado, inscripciones }) => {
  const [crearInscripcion, { data, loading, error }] =
    useMutation(CREAR_INSCRIPCION);
  const { userData } = useUser();
  const [estadoInscripcion, setEstadoInscripcion] = useState("");

  useEffect(() => {
    if (userData && inscripciones) {
      const filtro = inscripciones.filter(
        (el) => el.estudiante._id === userData._id
      );

      if (filtro.length > 0) {
        setEstadoInscripcion(filtro[0].estado);
      }
    }
  }, [userData, inscripciones]);

  useEffect(() => {
    if (data) {
      console.log(data);
      toast.success("Inscripcion creada con exito");
      
    }
  }, [data]);

  const confirmarInscripcion = () => {
    crearInscripcion({
      variables: { proyecto: idProyecto, estudiante: userData._id },
    });
  };

  return (
    <>
      {estadoInscripcion !== "" ? (
        <span>
          Te encuentras inscrito a este proyecto, Estado de Inscripcion:{" "}
          {estadoInscripcion}
        </span>
      ) : (
        <ButtonLoading
          onClick={() => confirmarInscripcion()}
          disabled={estado === "INACTIVO"}
          loading={loading}
          text="Inscribirse"
        />
      )}
    </>
  );
};

export default IndexProyectos;
