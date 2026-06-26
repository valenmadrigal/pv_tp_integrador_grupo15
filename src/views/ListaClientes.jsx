import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Button,
  Badge,
  Modal,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";

const API_URL = "https://fakestoreapi.com/users";

function ListaClientes() {

  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados para el formulario de alta
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
        setClientes(datos);
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

      {/* Toast de éxito/error */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          bg={toastError ? "danger" : "success"}
          show={toastVisible}
          onClose={() => setToastVisible(false)}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastError ? "Error" : "¡Éxito!"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMensaje}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Lista de Clientes</h2>
        <Button variant="success" onClick={() => setMostrarModal(true)}>
          + Nuevo Cliente
        </Button>
      </div>

      <InputGroup className="mb-4 shadow-sm" style={{ maxWidth: "450px" }}>
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
            Mostrando{" "}
            <Badge bg="primary">{clientesFiltrados.length}</Badge>
            {" "}de{" "}{clientes.length}{" "}clientes
          </p>

          {clientesFiltrados.length === 0 ? (
            <Alert variant="warning">
              No se encontraron clientes con ese apellido o ciudad.
            </Alert>
          ) : (
            <Table striped bordered hover responsive className="shadow rounded overflow-hidden">
              <thead className="table-dark">
                <tr>
                  <th>#ID</th>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Ciudad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.name.firstname} {cliente.name.lastname}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.phone}</td>
                    <td>{cliente.address.city}</td>
                    <td>
                      <Button variant="primary" size="sm" href={`/clientes/${cliente.id}`}>
                        Ver Ficha Completa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      {/* Modal formulario de alta */}
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
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    name="ciudad"
                    value={nuevoCliente.ciudad}
                    onChange={handleChange}
                    required
                  />
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