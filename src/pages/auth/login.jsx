import React, { useEffect } from "react";
import Input from "components/Input";
import ButtonLoading from "components/ButtonLoading";
import { Link } from "react-router-dom";
import useFormData from "hooks/useFormData";
import { LOGIN } from "graphql/auth/mutations";
import { useMutation } from "@apollo/client";
import { useAuth } from "context/authContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { form, formData, updateFormData } = useFormData();

  const [login, { data: mutationData, loadin: mutationLoading, error }] =
    useMutation(LOGIN);

  const submitForm = (e) => {
    e.preventDefault();

    login({
      variables: formData,
    })
      .then(() => {
        toast.success("Login exitoso");
      })
      .catch(() => {
        console.error("Error con la contraseña o usuario");
      });
  };

  //Para saber si la mutacion login trae informacion y crear un token para dar acceso
  useEffect(() => {
    if (mutationData) {
      if (mutationData.login.token) {
        setToken(mutationData.login.token);
        navigate("/");
      }
    }
  }, [mutationData, setToken, navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-10">
      <h1 className="text-xl font-bold text-gray-900">Iniciar sesión</h1>
      <form
        className="flex flex-col"
        onSubmit={submitForm}
        onChange={updateFormData}
        ref={form}
      >
        <Input name="correo" type="email" label="Correo" required={true} />
        <Input
          name="password"
          type="password"
          label="Contraseña"
          required={true}
        />
        <ButtonLoading
          disabled={Object.keys(formData).length === 0}
          loading={mutationLoading}
          text="Iniciar Sesión"
        />
      </form>
      <span>¿No tienes una cuenta?</span>
      <Link to="/auth/register">
        <span className="text-blue-700">Regístrate</span>
      </Link>
    </div>
  );
};

export default Login;
