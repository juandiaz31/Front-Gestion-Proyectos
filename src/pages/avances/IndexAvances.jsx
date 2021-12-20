import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useUser } from "context/userContext";
import { GET_AVANCES } from "graphql/avances/queries";
import { nanoid } from "nanoid";
import ButtonLoading from "components/ButtonLoading";
import { Dialog } from "@material-ui/core";
import Input from "components/Input";
import useFormData from "hooks/useFormData";
import { EDITAR_AVANCE } from "graphql/avances/mutations";
import { toast } from "react-toastify";
import { CREAR_OBSERVACION } from "graphql/avances/mutations";

const IndexAvances = () => {
  const { data, loading } = useQuery(GET_AVANCES);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-10 flex flex-col items-center">
      <h1 className="text-gray-900 text-xl font-bold uppercase p-4">Avances</h1>
      {data.Avances.map((avance) => (
        <ListaAvances avance={avance} />
      ))}
    </div>
  );
};

const ListaAvances = ({ avance }) => {
  const { userData } = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [mostrarCrearObservacion, setMostrarCrearObservacion] = useState(false);

  const idUser = userData._id;
  const idEstudiante = avance.creadoPor._id;
  const idLider = avance.proyecto.lider._id;

  return (
    <>
      {idUser === idLider && (
        <div className="flex flex-col bg-red-400 m-4  p-4 rounded-lg">
          <span>
            <strong>Proyecto: </strong> {avance.proyecto.nombre}
          </span>
          <span>
            <strong>Descripcion:</strong> {avance.descripcion}
          </span>
          <span>
            <strong>Fecha: </strong> {avance.fecha}
          </span>
          <span>
            <strong>Creado por : </strong> {avance.creadoPor.nombre}{" "}
            {avance.creadoPor.apellido}
          </span>
          <span>
            <strong>Lider: </strong> {avance.proyecto.lider.nombre}{" "}
            {avance.proyecto.lider.apellido}
          </span>
          <div className="flex flex-col">
            <strong>Observaciones: </strong>{" "}
            <>
              {avance.observaciones.map((observacion) => {
                return <span>- {observacion} </span>;
              })}
            </>
          </div>
          <ButtonLoading
            onClick={() => setMostrarCrearObservacion(true)}
            text="Agregar observacion"
            loading={false}
            disabled={false}
          />

          <Dialog
            open={mostrarCrearObservacion}
            onClose={() => setMostrarCrearObservacion(false)}
          >
            <CrearObservacion
              _id={avance._id}
              setOpenDialog={setMostrarCrearObservacion}
            />
          </Dialog>
        </div>
      )}

      {idUser === idEstudiante && (
        <div className="flex flex-col bg-red-400 m-4  p-4 rounded-lg">
          <i
            onClick={() => setOpenDialog(true)}
            className="mx-4 fas fa-pen text-blue-600 hover:text-blue-500"
          />
          <span>
            <strong>Proyecto: </strong> {avance.proyecto.nombre}
          </span>
          <span>
            <strong>Descripcion:</strong> {avance.descripcion}
          </span>
          <span>
            <strong>Fecha: </strong> {avance.fecha}
          </span>
          <span>
            <strong>Creado por : </strong> {avance.creadoPor.nombre}{" "}
            {avance.creadoPor.apellido}
          </span>
          <span>
            <strong>Lider: </strong> {avance.proyecto.lider.nombre}{" "}
            {avance.proyecto.lider.apellido}
          </span>
          <div className="flex flex-col">
            <strong>Observaciones: </strong>{" "}
            <>
              {avance.observaciones.map((observacion) => {
                return <span>- {observacion} </span>;
              })}
            </>
          </div>
          <Dialog
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
            }}
          >
            <FormEditAvance _id={avance._id} setOpenDialog={setOpenDialog} />
          </Dialog>
        </div>
      )}
    </>
  );
};

const CrearObservacion = ({ _id, setOpenDialog }) => {
  const { formData, form, updateFormData } = useFormData();

  const [crearObservacion, { loading: mutationLoading }] =
    useMutation(CREAR_OBSERVACION);

  const submitForm = (e) => {
    e.preventDefault();
    crearObservacion({
      variables: {
        _id,
        ...formData,
      },
    })
      .then(() => {
        toast.success("Observacion creada con exito");
        setOpenDialog(false);
      })
      .catch(() => {
        toast.error("Error creando la observacion");
      });
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900">Agregar observacion</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input name="observacion" type="text" required />
        <ButtonLoading
          text="Agregar observacion"
          loading={mutationLoading}
          disabled={Object.keys(formData).length === 0}
        />
      </form>
    </div>
  );
};

const FormEditAvance = ({ _id, setOpenDialog }) => {
  const { form, formData, updateFormData } = useFormData();

  const [editarAvance, { loading }] = useMutation(EDITAR_AVANCE);

  const submitForm = (e) => {
    e.preventDefault();

    editarAvance({
      variables: {
        _id: _id,
        descripcion: formData.descripcion,
      },
    })
      .then(() => {
        toast.success("Avance editado con exito");
        setOpenDialog(false);
      })
      .catch(() => {
        toast.error("Error editando el avance");
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900">Editar avance</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input
          label="Descripcion"
          name="descripcion"
          type="text"
          required={true}
        />
        <ButtonLoading
          text="Confirmar"
          loading={loading}
          disabled={Object.keys(formData).length === 0}
        />
      </form>
    </div>
  );
};

export default IndexAvances;
