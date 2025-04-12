import React from "react";
import { Container, Navbar, Form, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const WanderChat = () => {
    return (
        <>
            {/* Navbar */}
            <Navbar bg="light" expand="lg" className="shadow-sm p-3">
                <Container>
                    <Navbar.Brand href="#home" className="fw-bold fs-4">WanderChat</Navbar.Brand>
                </Container>
            </Navbar>

            {/* Hero Section */}
            <Container className="text-center mt-5">
                <h1 className="fw-bold">WanderChat</h1>
                <p className="text-primary">Plan your dream trip with personalized itineraries.</p>
            </Container>

            {/* Search Section */}
            <Container className="text-center mt-4">
                <Row className="justify-content-center">
                    <Col md={2} className="mb-2">
                        <Form.Control as="select" className="text-center">
                            <option>Travel days</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4+</option>
                        </Form.Control>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Form.Control type="text" placeholder="Destination" className="text-center" />
                    </Col>
                    <Col md={2} className="mb-2">
                        <Form.Control as="select" className="text-center">
                            <option>Travel style</option>
                            <option>Adventure</option>
                            <option>Relaxation</option>
                            <option>Cultural</option>
                        </Form.Control>
                    </Col>
                    <Col md={2} className="mb-2">
                        <Button variant="primary" className="w-100">✨ Run</Button>
                    </Col>
                </Row>
            </Container>

            {/* Recently Created Trips */}
            <Container className="text-center mt-5">
                <h3 className="fw-bold">Recently Created Trip Plans</h3>
                <Row className="mt-3 justify-content-center">
                    <Col md={2}>
                        <img src="https://via.placeholder.com/150" className="img-fluid rounded" alt="Trip 1" />
                    </Col>
                    <Col md={2}>
                        <img src="https://via.placeholder.com/150" className="img-fluid rounded" alt="Trip 2" />
                    </Col>
                    <Col md={2}>
                        <img src="https://via.placeholder.com/150" className="img-fluid rounded" alt="Trip 3" />
                    </Col>
                    <Col md={2}>
                        <img src="https://via.placeholder.com/150" className="img-fluid rounded" alt="Trip 4" />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default WanderChat;
