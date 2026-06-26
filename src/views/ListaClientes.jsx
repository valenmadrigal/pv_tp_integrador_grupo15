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
} from "react-bootstrap";

const API_URL = "https://fakestoreapi.com/users";

function ListaClientes() {

  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

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

  return (

    <Container className="py-4">

      <h2 className="mb-4 fw-bold">
        Lista de Clientes
      </h2>

      <InputGroup
        className="mb-4 shadow-sm"
        style={{ maxWidth: "450px" }}
      >

        <Form.Control

          placeholder="Buscar por apellido o ciudad..."

          value={busqueda}

          onChange={(e) => setBusqueda(e.target.value)}

        />

        {busqueda && (

          <Button
            variant="outline-secondary"
            onClick={() => setBusqueda("")}
          >

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

          <Alert.Heading>

            Error al cargar los clientes

          </Alert.Heading>

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

      {!cargando && !error && (

        <>

          <p className="text-muted mb-3 fw-semibold">

            Mostrando

            {" "}

            <Badge bg="primary">

              {clientesFiltrados.length}

            </Badge>

            {" "}de{" "}

            {clientes.length}

            {" "}clientes

          </p>

          {clientesFiltrados.length === 0 ? (

            <Alert variant="warning">

              No se encontraron clientes con ese apellido o ciudad.

            </Alert>

          ) : (

            <Table
              striped
              bordered
              hover
              responsive
              className="shadow rounded overflow-hidden"
            >

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

                    <td>

                      {cliente.name.firstname} {cliente.name.lastname}

                    </td>

                    <td>{cliente.email}</td>

                    <td>{cliente.phone}</td>

                    <td>{cliente.address.city}</td>

                    <td>

                      <Button
                        variant="primary"
                        size="sm"
                        href={`/clientes/${cliente.id}`}
                      >

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

    </Container>

  );

}

export default ListaClientes;