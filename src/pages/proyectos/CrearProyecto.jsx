import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USUARIOS } from "graphql/usuarios/queries";
import Input from "components/Input";
import DropDown from "components/Dropdown";
import ButtonLoading from "components/ButtonLoading";
import useFormData from "hooks/useFormData";
import { Enum_TipoObjetivo } from "utils/enum";
import { nanoid } from "nanoid";
import { ObjContext } from "context/objContext";
import { useObj } from "context/objContext";
import { CREAR_PROYECTO } from "graphql/proyectos/mutations";
import { toast } from "react-toastify";

const CrearProyecto = () => {
  const { form, formData, updateFormData } = useFormData();
  const [listaUsuarios, setListaUsuarios] = useState([]);

  const { data, error, loading } = useQuery(GET_USUARIOS, {
    variables: {
      filtro: { rol: "LIDER" },
    },
  });

  const [
    crearProyecto,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(CREAR_PROYECTO);

  useEffect(() => {
    if (data) {
      const lu = {};
      data.Usuarios.forEach((elemento) => {
        lu[elemento._id] = elemento.nombre + " " + elemento.apellido;
      });

      setListaUsuarios(lu);
    }
  }, [data]);

  useEffect(() => {
    console.log("data mutation", mutationData);
  });

  const submitForm = (e) => {
    e.preventDefault();
    formData.objetivos = Object.values(formData.objetivos);
    formData.presupuesto = parseFloat(formData.presupuesto);

    crearProyecto({
      variables: formData,
    });
    toast.success("Proyecto creado con exito");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flew flex-col w-full h-full items-center justify-center p-10">
      <Link to="/proyectos">
        <i className="fas fa-arrow-left text-gray-600 cursor-pointer font-bold text-xl hover:text-gray-900" />
      </Link>
      <h1 className="m-4 text-3xl text-gray-800 font-bold text-center">
        Crear un Proyecto
      </h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input
          label="Nombre del proyecto:"
          name="nombre"
          required={true}
          type="text"
        />
        <Input
          label="Presupuesto del proyecto:"
          name="presupuesto"
          required={true}
          type="number"
        />
        <Input
          label="Fecha de Inicio :"
          name="fechaInicio"
          required={true}
          type="date"
        />
        <Input
          label="Fecha de Fin:"
          name="fechaFin"
          required={true}
          type="date"
        />
        <DropDown
          label="Líder"
          name="lider"
          required={true}
          options={listaUsuarios}
        />
        <Objetivos />
        <ButtonLoading text="Crear proyecto" loading={false} disabled={false} />
      </form>
    </div>
  );
};

const Objetivos = () => {
  const [listaObjetivos, setListaObjetivos] = useState([]);

  const componenteObjetivoAgregado = () => {
    const id = nanoid();
    return <FormObjetivo key={id} id={id} />;
  };

  const eliminarObjetivo = (id) => {
    setListaObjetivos(listaObjetivos.filter((el) => el.props.id !== id));
  };

  return (
    <ObjContext.Provider value={{ eliminarObjetivo }}>
      <div>
        <span>Objetivos del proyecto</span>
        <i
          onClick={() =>
            setListaObjetivos([...listaObjetivos, componenteObjetivoAgregado()])
          }
          className="fas fa-plus mx-2"
        />
        {listaObjetivos.map((objetivo) => {
          return objetivo;
        })}
      </div>
    </ObjContext.Provider>
  );
};

const FormObjetivo = ({ id }) => {
  const { eliminarObjetivo } = useObj();
  return (
    <div className="flex">
      <Input
        name={`nested||objetivos||${id}||descripcion`}
        label="Descripcion"
        type="text"
        required={true}
      />
      <DropDown
        name={`nested||objetivos||${id}||tipo`}
        options={Enum_TipoObjetivo}
        label="Tipo Objetivo"
        required={true}
      />
      <i
        onClick={() => eliminarObjetivo(id)}
        className="fas fa-trash-alt p-2 mx-2 mt-9"
      />
    </div>
  );
};

export default CrearProyecto;
