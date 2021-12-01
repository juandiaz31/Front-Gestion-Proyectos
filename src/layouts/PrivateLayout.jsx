import React, { useEffect, useState } from "react";
import Sidebar from "components/Sidebar";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "context/authContext";
import { useMutation } from "@apollo/client";
import { REFRESH_TOKEN } from "graphql/auth/mutations";
import { useNavigate } from "react-router-dom";

const PrivateLayout = () => {
  const navigate = useNavigate();
  const { authToken, setToken } = useAuth();
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [
    refreshToken,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(REFRESH_TOKEN);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  useEffect(() => {
    if (mutationData) {
      if (mutationData.refreshToken.token) {
        setToken(mutationData.refreshToken.token);
      } else {
        setToken(null);
        navigate("/auth/login");
      }
      setLoadingAuth(false);
    }
  }, [mutationData, setToken, loadingAuth, navigate]);

  if (mutationLoading || loadingAuth) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row flex-no-wrap h-screen">
      <Sidebar />
      <div className="flex w-full h-full">
        <div className="w-full h-full  overflow-y-scroll">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PrivateLayout;
