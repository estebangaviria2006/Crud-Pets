import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function ProtectedRoute() {
  const auth = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth token:", auth); // Log the authentication token
    if (!auth) {
      Swal.fire({
        title: 'No está autenticado',
        text: 'Se quedara en la página de inicio de sesión.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        console.log("El usuario no está autenticado. Redirigiendo a la página de inicio de sesión..");
        navigate('/'); // Redirect to the login page if not logged in
      });
    }
  }, [auth, navigate]);

  if (!auth) {
    // Return null if not logged in to prevent rendering the protected content
    console.log("El usuario no está autenticado. Renderizando null.");
    return null;
  }

  // Render the protected content using Outlet if logged in
  console.log("El usuario está autenticado. Renderizando contenido protegido.");
  return <Outlet />;
}

export default ProtectedRoute;