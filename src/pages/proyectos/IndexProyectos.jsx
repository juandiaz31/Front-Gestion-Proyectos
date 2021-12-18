import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import PrivateComponent from "components/PrivateComponent";
import { Dialog } from "@mui/material";
import DropDown from "components/Dropdown";
import Input from "components/Input";
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
import { ELIMINAR_OBJETIVO } from "graphql/proyectos/mutations";
import ReactLoading from "react-loading";
import { Enum_TipoObjetivo } from "utils/enum";
import { EDITAR_OBJETIVO } from "graphql/proyectos/mutations";

const IndexProyectos = () => {
  const { data: queryData, loading } = useQuery(GET_PROYECTOS);

  useEffect(() => {
    console.log("datos proyecto", queryData);
  }, [queryData]);

  if (loading) return <div>Cargando...</div>;

  if (queryData.Proyectos) {
    return (
      <div className="p-10 flex flex-col items-center">
        <h1 className="text-gray-900 text-xl font-bold uppercase p-4">
          Proyectos
        </h1>
        <PrivateComponent roleList={["LIDER"]}>
          <div className="self-end my-5">
            <button className="bg-blue-500 p-2 rounded-lg shadow-sm text-white hover:bg-gray-400">
              <Link to="/proyectos/crear">Crear nuevo proyecto</Link>
            </button>
          </div>
        </PrivateComponent>
        {queryData.Proyectos.map((proyecto) => {
          return (
            <div className="w-full ">
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
              {proyecto.nombre} - {proyecto.estado} -{" "}
              <PrivateComponent roleList={["LIDER", "ADMINISTRADOR"]}>
                <i
                  className="mx-4 fas fa-pen text-gray-100 hover:text-gray-400"
                  onClick={() => {
                    setShowDialog(true);
                  }}
                />
              </PrivateComponent>
            </div>
          </div>
        </AccordionSummaryStyled>
        <AccordionDetailsStyled>
          <PrivateComponent roleList={["ESTUDIANTE"]}>
            <InscripcionProyecto
              idProyecto={proyecto._id}
              estado={proyecto.estado}
              inscripciones={proyecto.inscripciones}
            />
          </PrivateComponent>
          <div>
            <strong>Liderado por:</strong> {proyecto.lider.nombre}{" "}
            {proyecto.lider.apellido} -{proyecto.lider.identificacion}
          </div>

          <div>
            <strong>Fase del Proyecto: </strong>
            {proyecto.fase}
          </div>
          <div>
            {" "}
            <strong> Presupuesto: </strong>
            {proyecto.presupuesto}{" "}
          </div>
          <div>
            <strong>Fecha de Inicio: </strong>
            {proyecto.fechaInicio}{" "}
          </div>

          <div>
            <strong>Fecha de Terminacion: </strong>
            {proyecto.fechaFin}{" "}
          </div>
          <div className="my-2">
            <PrivateComponent roleList={["LIDER"]}>
              <Link
                to={`/avances/${proyecto._id}`}
                className="bg-yellow-400 p-2 my-2 rounded-lg text-white hover:bg-yellow-200"
              >
                Avances
              </Link>
            </PrivateComponent>
          </div>

          <div className="flex">
            {proyecto.objetivos.map((objetivo, index) => {
              return (
                <Objetivo
                  index={index}
                  _id={objetivo._id}
                  idProyecto={proyecto._id}
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
    })
      .then(() => {
        toast.success("Estado del proyecto actualizado");
      })
      .catch((error) => {
        toast.error("Error editando el proyecto");
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

const Objetivo = ({ _id, idProyecto, tipo, descripcion, index }) => {
  const [mostrarEdicionObjetivo, setMostrarEdicionObjetivo] = useState(false);

  const [
    eliminarObjetivo,
    { data: dataMutationEliminar, loading: loadingMutationEliminar },
  ] = useMutation(ELIMINAR_OBJETIVO, {
    refetchQueries: [{ query: GET_PROYECTOS }],
  });

  useEffect(() => {
    console.log("eliminar objetivo", dataMutationEliminar);
    if (dataMutationEliminar) {
      toast.success("Objetivo eliminado con exito.");
    }
  }, [dataMutationEliminar]);

  const ejecutarEliminarObjetivo = () => {
    eliminarObjetivo({
      variables: {
        idProyecto,
        idObjetivo: _id,
      },
    });
  };

  if (loadingMutationEliminar)
    return <ReactLoading type="spin" height={100} width={100} />;

  return (
    <div className="mx-5 my-4 bg-yellow-200 p-8 rounded-lg flex flex-col items-center justify-center shadow-xl">
      <div className="text-lg font-bold">{tipo}</div>
      <div>{descripcion}</div>
      <PrivateComponent roleList={["LIDER"]}>
        <div className="flex my-2">
          <i
            onClick={() => setMostrarEdicionObjetivo(true)}
            className="fas fa-pen text-yellow-600 hover:text-yellow-400 cursor-pointer mx-2"
          />
          <i
            onClick={ejecutarEliminarObjetivo}
            className="fas fa-trash text-red-600 hover:text-red-400 cursor-pointer mx-2"
          />
        </div>
        <Dialog
          open={mostrarEdicionObjetivo}
          onClose={() => setMostrarEdicionObjetivo(false)}
        >
          <EditarObjetivo
            descripcion={descripcion}
            tipo={tipo}
            index={index}
            idProyecto={idProyecto}
            setMostrarEdicionObjetivo={setMostrarEdicionObjetivo}
          />
        </Dialog>
      </PrivateComponent>
    </div>
  );
};

const EditarObjetivo = ({
  descripcion,
  tipo,
  index,
  idProyecto,
  setMostrarEdicionObjetivo,
}) => {
  const { form, formData, updateFormData } = useFormData();
  const [editarObjetivo, { data: dataMutation, loading }] = useMutation(
    EDITAR_OBJETIVO,
    {
      refetchQueries: [{ query: GET_PROYECTOS }],
    }
  );

  useEffect(() => {
    if (dataMutation) {
      toast.success("Objetivo editado con exito");
      setMostrarEdicionObjetivo(false);
    }
  }, [dataMutation, setMostrarEdicionObjetivo]);

  const submitForm = (e) => {
    e.preventDefault();
    editarObjetivo({
      variables: {
        idProyecto: idProyecto,
        indexObjetivo: index,
        campos: formData,
      },
    }).catch((e) => {
      console.log(e);
      toast.error("Error editanto el objetivo");
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900">Editar objetivo</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <DropDown
          label="Tipo de objetivo"
          name="tipo"
          required={true}
          options={Enum_TipoObjetivo}
          defaultValue={tipo}
        />
        <Input
          label="Descripcion objetivo"
          name="descripcion"
          required={true}
          defaultValue={descripcion}
        />
        <ButtonLoading
          text="Confirmar"
          disabled={Object.keys(formData).length === 0}
          loading={loading}
        />
      </form>
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
    <div>
      {estadoInscripcion !== "" ? (
        <div className="flex flex-col items-start">
          <span>
            Te encuentras inscrito a este proyecto, Estado de Inscripcion:{" "}
            {estadoInscripcion}
          </span>
          {/* Revisar esto porque los lideres no se pueden inscribir al proyecto ni pueden ser aceptados */}
          {estadoInscripcion === "ACEPTADO" && (
            <Link
              to={`/avances/${idProyecto}`}
              className="bg-yellow-400 p-2 my-2 rounded-lg text-white hover:bg-yellow-200"
            >
              Avances
            </Link>
          )}
        </div>
      ) : (
        <ButtonLoading
          onClick={() => confirmarInscripcion()}
          disabled={estado === "INACTIVO"}
          loading={loading}
          text="Inscribirse"
        />
      )}
    </div>
  );
};

export default IndexProyectos;
