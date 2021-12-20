import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USUARIO } from "graphql/usuarios/queries";
import Input from "components/Input";
import ButtonLoading from "components/ButtonLoading";
import useFormData from "hooks/useFormData";
import { toast } from "react-toastify";
import { EDITAR_USUARIO } from "graphql/usuarios/mutations";
import DropDown from "components/Dropdown";
import { Enum_EstadoUsuario } from "utils/enum";
import { EDITAR_ESTADO_USUARIO } from "graphql/usuarios/mutations";
import PrivateComponent from "components/PrivateComponent";
import { Enum_EstadoUsuarioLider } from "utils/enum";

const EditarUsuario = () => {
  const { form, formData, updateFormData } = useFormData(null);
  const { _id } = useParams();

  const {
    data: queryData,
    error: queryError,
    loading: queryLoading,
  } = useQuery(GET_USUARIO, {
    variables: { _id },
  });

  const [
    editarUsuario,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(EDITAR_ESTADO_USUARIO, {
    refetchQueries: [{ query: GET_USUARIO }],
  });

  const submitForm = (e) => {
    e.preventDefault();

    editarUsuario({
      variables: { _id, ...formData },
    })
      .then(() => {
        toast.success("Estado modificado con exito");
      })
      .catch(() => {
        toast.error("Error editando el estado");
      });
  };

  useEffect(() => {
    if (queryError) {
      toast.error("Error consultando el usuario");
    }
  }, [queryError]);

  if (queryLoading) return <div>Cargando....</div>;

  return (
    <div className="flew flex-col w-full h-full items-center justify-center p-10">
      <Link to="/usuarios">
        <i className="fas fa-arrow-left text-gray-600 cursor-pointer font-bold text-xl hover:text-gray-900" />
      </Link>
      <h1 className="m-4 text-3xl text-gray-800 font-bold text-center">
        Editar Usuario
      </h1>
      <form
        onSubmit={submitForm}
        onChange={updateFormData}
        ref={form}
        className="flex flex-col items-center justify-center"
      >
        <span>
          <strong>Nombre: </strong>
          {queryData.Usuario.nombre}
        </span>

        <span>
          <strong>Apellido: </strong>
          {queryData.Usuario.apellido}
        </span>

        <span>
          <strong>Correo: </strong>
          {queryData.Usuario.correo}
        </span>

        <span>
          <strong>Identificacion: </strong>
          {queryData.Usuario.identificacion}
        </span>
        <span>
          <strong>Rol del usuario: </strong> {queryData.Usuario.rol}
        </span>

        <PrivateComponent roleList={["ADMINISTRADOR"]}>
          <DropDown
            label="Estado:"
            name="estado"
            defaultValue={queryData.Usuario.estado}
            required={true}
            options={Enum_EstadoUsuario}
          />
        </PrivateComponent>

        <PrivateComponent roleList={["LIDER"]}>
          <DropDown
            label="Estado:"
            name="estado"
            defaultValue={queryData.Usuario.estado}
            required={true}
            options={Enum_EstadoUsuarioLider}
          />
        </PrivateComponent>

        <ButtonLoading
          disabled={Object.keys(formData).length === 0}
          loading={mutationLoading}
          text="Confirmar"
        />
      </form>
    </div>
  );
};

export default EditarUsuario;
