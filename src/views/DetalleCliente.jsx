import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  Badge,
} from "react-bootstrap";
import { AdminContext } from "../context/AdminContext";
import { PERMISOS } from "../constants/perfiles";
 
const API_URL = "https://fakestoreapi.com/users";
const LOCAL_STORAGE_KEY = "clientesAgregados";
 
function DetalleCliente() {
  
  const { id } = useParams();
  const navigate = useNavigate();
 
  
  const { admin, tienePermiso } = useContext(AdminContext);
 
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [eliminado, setEliminado] = useState(false);
 
 
 useEffect(() => {
  const obtenerCliente = async () => {
    try {
      setCargando(true);
      setError(null);

     
      const respuesta = await fetch(`${API_URL}/${id}`);

          if (respuesta.ok) {
            const datos = await respuesta.json();

  
         if (datos && Number(datos.id) === Number(id)) {
         setCliente(datos);
         return;
        }
      }  

      
      const clientesLocales =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

      const clienteLocal = clientesLocales.find(
        (c) => Number(c.id) === Number(id)
      );

      if (clienteLocal) {
        setCliente(clienteLocal);
      } else {
        throw new Error("Cliente no encontrado.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  obtenerCliente();
}, [id]);
 

  const handleEliminar = async () => {
  const confirmar = window.confirm(
    `¿Seguro que querés eliminar al cliente #${id}?`
  );

  if (!confirmar) return;

  try {
    setEliminando(true);

    
    const clientesLocales =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

    const existeLocal = clientesLocales.some(
      (c) => Number(c.id) === Number(id)
    );

    if (existeLocal) {
      const nuevosClientes = clientesLocales.filter(
        (c) => Number(c.id) !== Number(id)
      );

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(nuevosClientes)
      );

      setEliminado(true);
      return;
    }

    
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      throw new Error(`No se pudo eliminar: ${respuesta.status}`);
    }

    setEliminado(true);
  } catch (err) {
    setError(err.message);
  } finally {
    setEliminando(false);
  }
};
 
 
  return (
    <Container className="py-4">
      
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate("/clientes")}
      >
        ← Volver a la lista
      </Button>
 

      {cargando && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" variant="primary" />
          <span>Cargando ficha del cliente...</span>
        </div>
      )}
 
     
      {!cargando && error && (
        <Alert variant="danger">
          <Alert.Heading>Error al cargar la ficha</Alert.Heading>
          <p>{error}</p>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </Alert>
      )}
 
      
      {eliminado && (
        <Alert variant="success">
          <Alert.Heading>Cliente eliminado correctamente</Alert.Heading>
          <p>
            El cliente #{id} fue eliminado de la base de datos (simulación —
            FakeStoreAPI no borra datos reales).
          </p>
          <Button variant="outline-success" onClick={() => navigate("/clientes")}>
            Volver a la lista
          </Button>
        </Alert>
      )}
 
     
      {!cargando && !error && cliente && !eliminado && (
        <>
          <h2 className="fw-bold mb-4">
            Ficha de Cliente{" "}
            <Badge bg="secondary">#{cliente.id}</Badge>
          </h2>
 
          <Row className="g-4">
            
            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-dark text-white fw-bold">
                  Datos Personales
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Nombre completo:</strong>{" "}
                    {cliente.name.firstname} {cliente.name.lastname}
                  </p>
                  <p>
                    <strong>Email:</strong> {cliente.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {cliente.phone}
                  </p>
                </Card.Body>
              </Card>
            </Col>
 
            
            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-dark text-white fw-bold">
                  Dirección
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Calle:</strong> {cliente.address.street}
                  </p>
                  <p>
                    <strong>Número:</strong> {cliente.address.number}
                  </p>
                  <p>
                    <strong>Ciudad:</strong> {cliente.address.city}
                  </p>
                  <p>
                    <strong>Código Postal:</strong> {cliente.address.zipcode}
                  </p>
                </Card.Body>
              </Card>
            </Col>
 
            
            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-dark text-white fw-bold">
                  Credenciales de Acceso
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Usuario:</strong> {cliente.username}
                  </p>
                  <p>
                    <strong>Contraseña:</strong> {cliente.password}
                  </p>
                </Card.Body>
              </Card>
            </Col>
 
           
            <Col md={6}>
              <Card className="h-100 shadow-sm border-info">
                <Card.Header className="bg-info text-white fw-bold">
                  Tu Acceso
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Administrador:</strong> {admin?.nombre}
                  </p>
                  <p>
                    <strong>Sector:</strong>{" "}
                    <Badge
                      bg={admin?.sector === "Gerencia" ? "danger" : "primary"}
                    >
                      {admin?.sector}
                    </Badge>
                  </p>
                  <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                    {tienePermiso(PERMISOS.ELIMINAR_CLIENTES)
                      ? "Tenés permisos para eliminar clientes."
                      : "Solo podés visualizar los datos del cliente."}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
 
         
          {tienePermiso(PERMISOS.ELIMINAR_CLIENTES) && (
            <div className="mt-4">
              <Button
                variant="danger"
                onClick={handleEliminar}
                disabled={eliminando}
              >
                {eliminando ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Eliminando...
                  </>
                ) : (
                  "🗑️ Eliminar Cliente de la Base de Datos"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
 
export default DetalleCliente;