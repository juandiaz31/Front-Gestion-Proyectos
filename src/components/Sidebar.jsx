import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "context/authContext";
import PrivateComponent from "./PrivateComponent";
const SidebarLinks = () => {
  return (
    <ul className="mt-12">
      <SidebarRoute to="" title="Inicio" icon="fas fa-home" />
      <SidebarRoute to="/perfil" title="Perfil" icon="fas fa-user" />
      <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
        <SidebarRoute to="/usuarios" title="Usuarios" icon="fas fa-users" />
      </PrivateComponent>
      <SidebarRoute to="/proyectos" title="Proyectos" icon="fas fa-file-alt" />
      <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
       <SidebarRoute to="/inscripciones" title="Inscripciones" icon="fas fa-file-alt" />
      </PrivateComponent>
      <Logout />
    </ul>
  );
};

const Logout = () => {
  const { setToken } = useAuth();
  const deleteToken = () => {
    setToken(null);
  };
  return (
    <li>
      <NavLink to="/auth/login" className="sidebar-route text-white">
        <div className="flex items-center" onClick={() => deleteToken()}>
          <i className="fas fa-sign-out-alt" />
          <span className="text-sm  ml-2">Cerrar Sesión</span>
        </div>
      </NavLink>
    </li>
  );
};

const Logo = () => {
  return (
    <div className="py-3 w-full flex flex-col items-center justify-center">
      <img src="logo.png" alt="Logo" className="h-16" />
      <span className="my-2 text-xl font-bold text-center">
        Gestion de proyectos
      </span>
    </div>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col md:flex-row flex-no-wrap md:h-full">
      {/* Sidebar starts */}

      <div className="sidebar hidden md:flex">
        <div className="px-8">
          <Logo />
          <SidebarLinks />
        </div>
      </div>
      <div className="flex md:hidden w-full justify-between bg-gray-800 p-2 text-white">
        <i
          className={`fas fa-${open ? "times" : "bars"}`}
          onClick={() => setOpen(!open)}
        />
        <i className="fas fa-home" />
      </div>
      {open && <ResponsiveSidebar />}
      {/* Sidebar ends */}
    </div>
  );
};

const ResponsiveSidebar = () => {
  return (
    <div>
      <div
        className="sidebar h-full z-40 absolute md:h-full sm:hidden transition duration-150 ease-in-out"
        id="mobile-nav"
      >
        <div className="px-8">
          <Logo />
          <SidebarLinks />
        </div>
      </div>
    </div>
  );
};

const SidebarRoute = ({ to, title, icon }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? "sidebar-route text-white bg-blue-500"
            : "sidebar-route text-gray-900 hover:text-white hover:bg-blue-400"
        }
      >
        <div className="flex items-center">
          <i className={icon} />
          <span className="text-sm  ml-2">{title}</span>
        </div>
      </NavLink>
    </li>
  );
};

export default Sidebar;
