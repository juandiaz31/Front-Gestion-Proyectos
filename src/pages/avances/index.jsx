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
import PrivateComponent from "components/PrivateComponent";
import { CREAR_OBSERVACION } from "graphql/avances/mutations";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
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
      <Link to="/avances">
        <i className="fas fa-arrow-left text-gray-600 cursor-pointer font-bold text-xl hover:text-gray-900" />
      </Link>
      <h1 className="text-gray-900 text-xl font-bold uppercase">
        Avances del proyecto {projectid}
      </h1>

      <div className="self-end my-5">
        <PrivateComponent roleList={["ESTUDIANTE"]}>
          <button
            onClick={() => setOpenDialog(true)}
            className="bg-blue-500 p-2 rounded-lg shadow-sm text-white hover:bg-gray-400"
          >
            Crear avance
          </button>
        </PrivateComponent>

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
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex flex-col bg-red-400 m-4  p-4 rounded-lg">
      <span>
        <strong>Descripcion:</strong> {avance.descripcion}
      </span>
      <span>
        <strong>Fecha: </strong> {avance.fecha}
      </span>
      <div className="flex flex-col">
        <strong> Observaciones:</strong>{" "}
        <>
          {avance.observaciones.map((observacion) => {
            return <span key={nanoid()}>- {observacion} </span>;
          })}
        </>
      </div>
      <PrivateComponent roleList={["LIDER"]}>
        <button
          onClick={() => setOpenDialog(true)}
          className="bg-blue-500 p-2 rounded-lg shadow-sm text-white hover:bg-blue-400"
        >
          Agregar observacion
        </button>
      </PrivateComponent>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
      >
        <CrearObservacion _id={avance._id} setOpenDialog={setOpenDialog} />
      </Dialog>
    </div>
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
