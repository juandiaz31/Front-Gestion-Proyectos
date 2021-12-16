import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
// import { GET_AVANCES } from "graphql/avances/queries";
import { useParams } from "react-router-dom";
import { Dialog } from "@mui/material";
import Input from "components/Input";
import ButtonLoading from "components/ButtonLoading";
import useFormData from "hooks/useFormData";
import { CREAR_AVANCE } from "graphql/avances/mutations";
import { useUser } from "context/userContext";
import { toast } from "react-toastify";
import { FILTRAR_AVANCES } from "graphql/avances/queries";

const IndexAvances = () => {
  const { projectid } = useParams();
  const [openDialog, setOpenDialog] = useState(false);

  //   const { data, loading } = useQuery(GET_AVANCES, {
  //     variables: {
  //       project: projectid,
  //     },
  //   });

  const { data: queryData, loading } = useQuery(FILTRAR_AVANCES, {
    variables: {
      id: projectid,
    },
  });

  useEffect(() => {
    // console.log("data get avances", data);
    console.log("data FILTRAR avances", queryData);
  }, [queryData]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-10 flex flex-col items-center">
      <h1 className="text-gray-900 text-xl font-bold uppercase">
        Avances del proyecto {projectid}
      </h1>
      <div className="self-end my-5">
        <button
          onClick={() => setOpenDialog(true)}
          className="bg-blue-500 p-2 rounded-lg shadow-sm text-white hover:bg-gray-400"
        >
          Crear avance
        </button>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <CrearAvance proyecto={projectid} setOpenDialog={setOpenDialog} />
        </Dialog>
      </div>
      {queryData.filtrarAvance.length === 0 ? (
        <span>Este proyecto no tiene avances</span>
      ) : (
        queryData.filtrarAvance.map((avance) => <Avance avance={avance} />)
      )}
    </div>
  );
};

const Avance = ({ avance }) => {
  return (
    <div className="flex flex-col bg-red-400 m-4  p-4 rounded-lg">
      <span>Descripcion: {avance.descripcion}</span>
      <span>Fecha: {avance.fecha}</span>
      <span>Observaciones: {avance.observaciones}</span>
    </div>
  );
};

const CrearAvance = ({ proyecto, setOpenDialog }) => {
  const { userData } = useUser();
  const { form, formData, updateFormData } = useFormData();

  const [crearAvance, { loading }] = useMutation(CREAR_AVANCE, {
    refetchQueries: [FILTRAR_AVANCES],
  });

  const submitForm = (e) => {
    e.preventDefault();

    crearAvance({
      variables: { ...formData, proyecto, creadoPor: userData._id },
    })
      .then(() => {
        toast.success("avance creado con exito");
        setOpenDialog(false);
      })
      .catch(() => {
        toast.error("error creando el avance");
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900">Crear nuevo avance</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input label="Descripcion" name="descripcion" type="text" required />
        <Input label="Fecha" name="fecha" type="date" required />
        <ButtonLoading
          text="Confirmar"
          disabled={Object.keys(formData).length === 0}
          loading={loading}
        />
      </form>
    </div>
  );
};

export default IndexAvances;
