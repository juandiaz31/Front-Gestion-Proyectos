import React from "react";
import PrivateRoute from "components/PrivateRoute";
import { render, screen, cleanup } from "@testing-library/react";
import { UserContext } from "context/userContext";

afterEach(cleanup);

it("renders not authorized if the roles dont match", () => {
  render(
    <UserContext.Provider value={{ userData: { rol: "LIDER" } }}>
      <PrivateRoute roleList={["ADMINISTRADOR"]}>
        <div>Este son los children</div>
      </PrivateRoute>
    </UserContext.Provider>
  );
  expect(screen.getByTestId("no-autorizado")).toHaveTextContent(
    "No estás autorizado para ver este sitio."
  );
});

it("renders the children if the user role is in the roleList", () => {
  render(
    <UserContext.Provider value={{ userData: { rol: "ADMINISTRADOR" } }}>
      <PrivateRoute roleList={["ADMINISTRADOR"]}>
        <div data-testid="children">Este son los children</div>
      </PrivateRoute>
    </UserContext.Provider>
  );
  expect(screen.getByTestId("children")).toBeInTheDocument();
});
