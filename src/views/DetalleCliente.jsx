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
 
function DetalleCliente() {
  // useParams captura el :id dinámico de la URL (/clientes/3 → id = "3")
  const { id } = useParams();
  const navigate = useNavigate();
 
  // Leemos el sector del admin logueado para controlar el botón de eliminar
  const { admin, tienePermiso } = useContext(AdminContext);
 
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [eliminado, setEliminado] = useState(false);
 
  // ----- Fetch del cliente por ID -----
  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        setCargando(true);
        setError(null);
 
        const respuesta = await fetch(`${API_URL}/${id}`);
 
        if (!respuesta.ok) {
          throw new Error(`Error del servidor: ${respuesta.status}`);
        }
 
        const datos = await respuesta.json();
        setCliente(datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
 
    obtenerCliente();
  }, [id]); // si el id de la URL cambia, vuelve a fetchear
 
  // ----- Eliminar cliente (solo Gerencia) -----
  const handleEliminar = async () => {
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar al cliente #${id} de la base de datos?`
    );
    if (!confirmar) return;
 
    try {
      setEliminando(true);
 
      // FakeStoreAPI acepta DELETE pero no elimina nada realmente —
      // es una simulación. Lo importante es que la petición se hace
      // y el servidor responde con el objeto eliminado.
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
 
  // ----- Render -----
  return (
    <Container className="py-4">
      {/* Botón volver */}
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate("/clientes")}
      >
        ← Volver a la lista
      </Button>
 
      {/* Estado: cargando */}
      {cargando && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" variant="primary" />
          <span>Cargando ficha del cliente...</span>
        </div>
      )}
 
      {/* Estado: error */}
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
 
      {/* Estado: cliente eliminado */}
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
 
      {/* Estado: éxito — ficha del cliente */}
      {!cargando && !error && cliente && !eliminado && (
        <>
          <h2 className="fw-bold mb-4">
            Ficha de Cliente{" "}
            <Badge bg="secondary">#{cliente.id}</Badge>
          </h2>
 
          <Row className="g-4">
            {/* Datos personales */}
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
 
            {/* Dirección — desestructurando el objeto anidado address */}
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
 
            {/* Credenciales de acceso */}
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
 
            {/* Sector del admin logueado — info del contexto */}
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
 
          {/* Botón Eliminar — solo visible para sector "Gerencia" */}
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