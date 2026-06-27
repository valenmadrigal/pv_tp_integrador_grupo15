import { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { AdminContext } from "../context/AdminContext";
import { PERMISOS, PERFILES } from "../constants/perfiles";

function Dashboard() {
  const { admin, tienePermiso } = useContext(AdminContext);

  const esGerencia = admin?.sector === PERFILES.GERENCIA;

  return (
    <Container className="py-2">
      <div className="dashboard-hero mb-4">
        <div>
          <p className="dashboard-hero__eyebrow mb-1">Panel de control</p>
          <h2 className="dashboard-hero__title mb-2">
            Bienvenido, {admin?.nombre}
          </h2>
          <p className="dashboard-hero__subtitle mb-0">
            Gestioná clientes y accesos desde un único lugar.
          </p>
        </div>
        <Badge
          bg={esGerencia ? "danger" : "primary"}
          className="dashboard-hero__badge"
        >
          {admin?.sector}
        </Badge>
      </div>

      <Row className="g-4 mb-4">
        <Col md={6} lg={4}>
          <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="dashboard-stat-card__icon dashboard-stat-card__icon--user">
                👤
              </div>
              <Card.Title className="mt-3 mb-1">Tu perfil</Card.Title>
              <Card.Text className="text-muted mb-2">
                Administrador activo en el sistema.
              </Card.Text>
              <p className="mb-1">
                <strong>Nombre:</strong> {admin?.nombre}
              </p>
              <p className="mb-0">
                <strong>Sector:</strong>{" "}
                <Badge bg={esGerencia ? "danger" : "primary"}>
                  {admin?.sector}
                </Badge>
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="dashboard-stat-card__icon dashboard-stat-card__icon--clients">
                📋
              </div>
              <Card.Title className="mt-3 mb-1">Clientes</Card.Title>
              <Card.Text className="text-muted mb-3">
                Consultá la lista completa y las fichas individuales.
              </Card.Text>
              <Button
                as={Link}
                to="/clientes"
                variant="outline-primary"
                className="w-100"
              >
                Ir a Clientes
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} lg={4}>
          <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="dashboard-stat-card__icon dashboard-stat-card__icon--access">
                🔐
              </div>
              <Card.Title className="mt-3 mb-1">Permisos</Card.Title>
              <Card.Text className="text-muted mb-3">
                Acciones habilitadas según tu perfil.
              </Card.Text>
              <ul className="dashboard-permissions list-unstyled mb-0">
                <li>
                  {tienePermiso(PERMISOS.VER_CLIENTES) ? "✅" : "❌"} Ver
                  clientes
                </li>
                <li>
                  {tienePermiso(PERMISOS.CREAR_CLIENTES) ? "✅" : "❌"} Crear
                  clientes
                </li>
                <li>
                  {tienePermiso(PERMISOS.ELIMINAR_CLIENTES) ? "✅" : "❌"}{" "}
                  Eliminar clientes
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="dashboard-info-card border-0 shadow-sm">
        <Card.Body className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h5 className="mb-2 fw-bold">Estado de la sesión</h5>
            <p className="text-muted mb-0">
              Tu sesión se mantiene activa mediante{" "}
              <strong>Context API</strong> y <strong>LocalStorage</strong>, por
              lo que no necesitás volver a iniciar sesión al recargar la
              página.
            </p>
          </div>
          <Badge bg="success" className="dashboard-session-badge">
            Sesión activa
          </Badge>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Dashboard;
