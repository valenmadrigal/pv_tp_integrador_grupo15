import { useEffect, useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { PERMISOS } from "../constants/perfiles";
import { CIUDADES_JUJUY } from "../constants/ciudadesJujuy";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Button,
  Badge,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";
 
const API_URL = "https://fakestoreapi.com/users";
const LOCAL_STORAGE_KEY = "clientesAgregados";
 
function ListaClientes() {
  const { tienePermiso } = useContext(AdminContext);

  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
 
  const [mostrarModal, setMostrarModal] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMensaje, setToastMensaje] = useState("");
  const [toastError, setToastError] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    ciudad: "",
    username: "",
    password: "",
  });
 
  useEffect(() => {
  const obtenerClientes = async () => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch(API_URL);

      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
      }

      const datos = await respuesta.json();

      
      const clientesLocales =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

      setClientes([...datos, ...clientesLocales]);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  obtenerClientes();
}, []);
 
  const clientesFiltrados = clientes.filter((cliente) => {
    const termino = busqueda.toLowerCase();
    const apellido = cliente.name.lastname.toLowerCase();
    const ciudad = cliente.address.city.toLowerCase();
    return apellido.includes(termino) || ciudad.includes(termino);
  });
 
  const handleChange = (e) => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };
 
const handleSubmit = async (e) => {
  e.preventDefault();

  const confirmar = window.confirm(
    "¿Está seguro de que desea registrar este cliente?"
  );

  if (!confirmar) {
    return;
  }

  setEnviando(true);

  const payload = {
    email: nuevoCliente.email,
    username: nuevoCliente.username,
    password: nuevoCliente.password,
    name: {
      firstname: nuevoCliente.nombre,
      lastname: nuevoCliente.apellido,
    },
    address: {
      city: nuevoCliente.ciudad,
      street: "",
      number: 0,
      zipcode: "",
    },
    phone: nuevoCliente.telefono,
  };
 
    try {
      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
 
      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
      }
 
      const datos = await respuesta.json();

const clienteNuevo = {
  id: Date.now(),
  email: nuevoCliente.email,
  username: nuevoCliente.username,
  password: nuevoCliente.password,

  name: {
    firstname: nuevoCliente.nombre,
    lastname: nuevoCliente.apellido,
  },

  phone: nuevoCliente.telefono,

  address: {
    city: nuevoCliente.ciudad,
    street: "",
    number: 0,
    zipcode: "",
    geolocation: {
      lat: "",
      long: "",
    },
  },
};


const clientesLocales =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];


clientesLocales.push(clienteNuevo);


localStorage.setItem(
  LOCAL_STORAGE_KEY,
  JSON.stringify(clientesLocales)
);


setClientes((prev) => [...prev, clienteNuevo]);
 
      setToastMensaje(`Cliente dado de alta con éxito. ID asignado: ${datos.id}`);
      setToastError(false);
      setToastVisible(true);
      setMostrarModal(false);
      setNuevoCliente({
        nombre: "", apellido: "", email: "",
        telefono: "", ciudad: "", username: "", password: "",
      });
 
    } catch (err) {
      setToastMensaje(`Error al dar de alta: ${err.message}`);
      setToastError(true);
      setToastVisible(true);
    } finally {
      setEnviando(false);
    }
  };
 
  return (
    <Container className="py-4">
 
     
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          bg={toastError ? "danger" : "success"}
          show={toastVisible}
          onClose={() => setToastVisible(false)}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">{toastError ? "Error" : "¡Éxito!"}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMensaje}</Toast.Body>
        </Toast>
      </ToastContainer>
 
    
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Lista de Clientes</h2>
        {tienePermiso(PERMISOS.CREAR_CLIENTES) && (
          <Button variant="success" onClick={() => setMostrarModal(true)}>
            + Nuevo Cliente
          </Button>
        )}
      </div>
 
     
      <InputGroup className="mb-4" style={{ maxWidth: 450 }}>
        <Form.Control
          placeholder="Buscar por apellido o ciudad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <Button variant="outline-secondary" onClick={() => setBusqueda("")}>
            ✕
          </Button>
        )}
      </InputGroup>
 
     
      {cargando && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" variant="primary" />
          <span>Cargando clientes...</span>
        </div>
      )}
 
      
      {!cargando && error && (
        <Alert variant="danger">
          <Alert.Heading>Error al cargar los clientes</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" size="sm" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </Alert>
      )}
 
      
      {!cargando && !error && (
        <>
          <p className="text-muted mb-3 fw-semibold">
            Mostrando <Badge bg="primary">{clientesFiltrados.length}</Badge>{" "}
            de {clientes.length} clientes
          </p>
 
          {clientesFiltrados.length === 0 ? (
            <Alert variant="warning">
              No se encontraron clientes con ese apellido o ciudad.
            </Alert>
          ) : (
            <Row xs={1} sm={2} lg={3} className="g-4">
              {clientesFiltrados.map((cliente) => (
                <Col key={cliente.id}>
                  <Card className="h-100 shadow-sm">
                    {/* Cabecera de la card con avatar inicial */}
                    <Card.Header className="bg-primary text-white d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        {cliente.name.firstname.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-bold">
                        {cliente.name.firstname} {cliente.name.lastname}
                      </span>
                    </Card.Header>
 
                    <Card.Body>
                      <p className="mb-1">
                        <small className="text-muted">Email</small>
                        <br />
                        {cliente.email}
                      </p>
                      <p className="mb-1 mt-2">
                        <small className="text-muted">Teléfono</small>
                        <br />
                        {cliente.phone}
                      </p>
                      <p className="mb-0 mt-2">
                        <small className="text-muted">Ciudad</small>
                        <br />
                        {cliente.address.city}
                      </p>
                    </Card.Body>
 
                    <Card.Footer className="bg-white border-top-0">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="w-100"
                        href={`/clientes/${cliente.id}`}
                      >
                        Ver Ficha Completa
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
 
      
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={nuevoCliente.nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    name="apellido"
                    value={nuevoCliente.apellido}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={nuevoCliente.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    name="telefono"
                    value={nuevoCliente.telefono}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad (Jujuy)</Form.Label>
                  <Form.Select
                    name="ciudad"
                    value={nuevoCliente.ciudad}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar ciudad...</option>
                    {CIUDADES_JUJUY.map((ciudad) => (
                      <option key={ciudad} value={ciudad}>
                        {ciudad}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="username"
                    value={nuevoCliente.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={nuevoCliente.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
 
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                Cancelar
              </Button>
              <Button variant="success" type="submit" disabled={enviando}>
                {enviando ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cliente"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
 
    </Container>
  );
}
 
export default ListaClientes;