import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const OrderSection = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col className="d-flex justify-content-center gap-2 gap-md-3 gap-lg-5">
          <Button size="md" className="filter-button">
            Coffe
          </Button>
          <Button size="md" className="filter-button">
            Food
          </Button>
          <Button size="md" className="filter-button">
            Beverages
          </Button>
          <Button size="md" className="filter-button">
            Promo
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSection;
