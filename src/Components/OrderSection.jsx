import { useState } from "react";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import Coffe from "../Assets/Coffe.jpg";

const OrderSection = () => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col className="d-flex justify-content-center gap-3 gap-md-3 gap-lg-5">
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
      <Row className="justify-content-center mt-5">
        <Col xs={12}>
          <Card>
            <Row noGutters={true} className="align-items-stretch">
              <Col xs={4} md={2} className="d-flex">
                <Card.Img
                  variant="top"
                  src={Coffe}
                  className="h-100"
                  style={{ objectFit: "cover" }}
                />
              </Col>
              <Col xs={8} md={8}>
                <Card.Body>
                  <Card.Title>Coffee Name</Card.Title>
                  <Card.Text>Coffe Dengan Sianida</Card.Text>
                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Label htmlFor="price">Price:</Form.Label>
                      <Form.Control
                        type="text"
                        id="price"
                        value="Rp. 10.000"
                        disabled
                      />
                    </Col>
                    <Col
                      sm={12}
                      md={6}
                      className="d-flex align-items-end justify-content-md-end mt-2 mt-md-0"
                    >
                      <Button className="add-to-cart">Order</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSection;
