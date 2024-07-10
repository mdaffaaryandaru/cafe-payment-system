import Carousel from "react-bootstrap/Carousel";
import CarouselImage from "../../Assets/Carousel-image.png";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

export const CarouselSlide = () => {
  return (
    <Container fluid>
      <Row>
        <Col className="px-0">
          <Carousel slide={true}>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={CarouselImage}
                alt="First slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={CarouselImage}
                alt="Second slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={CarouselImage}
                alt="Third slide"
              />
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

export default CarouselSlide;
