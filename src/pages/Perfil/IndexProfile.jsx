import React, { useEffect } from "react";
import ButtonLoading from "components/ButtonLoading";
import Input from "components/Input";
import { useUser } from "context/userContext";
import useFormData from "hooks/useFormData";
import { useQuery, useMutation } from "@apollo/client";

import { EDITAR_PERFIL } from "graphql/usuarios/mutations";
import { toast } from "react-toastify";

import { GET_USUARIO } from "graphql/usuarios/queries";
import { EDITAR_PASSWORD } from "graphql/auth/mutations";

const IndexProfile = () => {
  const { form, formData, updateFormData } = useFormData();
  const { userData } = useUser();

  const [editarPerfil, { data: dataMutation, loading: loadingMutation }] =
    useMutation(EDITAR_PERFIL, {
      refetchQueries: [{ query: GET_USUARIO }],
    });

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_USUARIO, {
    variables: {
      _id: userData._id,
    },
  });

  const [editarPassword, { data: dataPassword }] = useMutation(EDITAR_PASSWORD);

  const submitForm = (e) => {
    e.preventDefault();

    editarPerfil({
      variables: {
        _id: userData._id,
        campos: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          identificacion: formData.identificacion,
          correo: formData.correo,
        },
      },
    })
      .then(() => {
        toast.success("Perfil modificado con exito");
      })
      .catch(() => {
        toast.error("Error editanto el perfil");
      });

    editarPassword({
      variables: {
        _id: userData._id,
        password: formData.password,
      },
    })
      .then(() => {
        toast.success("Contraseña modificado con exito");
      })
      .catch(() => {
        toast.error("Error editanto la contraseña");
      });
  };

  if (queryLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col items-center justify-center w-full p-10">
      <h1 className="text-gray-900 text-xl font-bold uppercase my-5">Perfil</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input
          defaultValue={queryData.Usuario.nombre}
          label="Nombre"
          name="nombre"
          type="text"
          required={true}
        />
        <Input
          defaultValue={queryData.Usuario.apellido}
          label="Apellido"
          name="apellido"
          type="text"
          required={true}
        />
        <Input
          defaultValue={queryData.Usuario.identificacion}
          label="Identificacion"
          name="identificacion"
          type="text"
          required={true}
        />
        <Input
          defaultValue={queryData.Usuario.correo}
          label="Correo"
          name="correo"
          type="email"
          required={true}
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          required={true}
        />
        <ButtonLoading
          text="Guardar"
          loading={loadingMutation}
          disabled={Object.keys(formData).length === 0}
        />
      </form>
    </div>
  );
};

export default IndexProfile;
