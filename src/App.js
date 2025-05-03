import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { Container, Navbar, Form, Button, Row, Col, Card, ListGroup, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { debounce } from "lodash";
import TripOutputPage from "./TripOutputPage.jsx";

const WanderChat = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState("");
    const [travelDays, setTravelDays] = useState("");
    const [travelStyle, setTravelStyle] = useState("");
    const [budget, setBudget] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const fetchDestinations = useCallback(
        debounce(async (input) => {
            if (!input) {
                setSuggestions([]);
                setLoadingSuggestions(false);
                return;
            }

            setLoadingSuggestions(true);
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";
            const url = `${backendUrl}/fetch-cities?namePrefix=${encodeURIComponent(input)}`;
            console.log("Fetching destinations from:", url);
            try {
                const response = await fetch(url);
                console.log("Response status:", response.status);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                console.log("Response data:", data);
                setSuggestions(data.data ? data.data.map((city) => city.city || city.name) : []);
            } catch (error) {
                console.error("Error fetching destinations:", error.message);
                setSuggestions([]);
            } finally {
                setLoadingSuggestions(false);
            }
        }, 300),
        []
    );

    const handleSelectSuggestion = (city) => {
        setDestination(city);
        setSuggestions([]);
    };

    const handleRunClick = () => {
        if (!destination || !travelDays || !travelStyle || !budget) {
            alert("Please fill all fields!");
            return;
        }
        if (isNaN(budget) || budget <= 0) {
            alert("Budget must be a positive number!");
            return;
        }
        if (isNaN(travelDays) || travelDays <= 0) {
            alert("Travel days must be a positive number!");
            return;
        }
        navigate("/output", { state: { destination, travelDays, travelStyle, budget } });
    };

    return (
        <>
            <Navbar bg="dark" expand="lg" className="shadow-sm p-3">
                <Container>
                    <Navbar.Brand href="/" className="fw-bold fs-4 text-white">
                        WanderChat
                    </Navbar.Brand>
                </Container>
            </Navbar>

            <Container className="text-center mt-5">
                <h1 className="fw-bold">WanderChat</h1>
                <p className="text-primary">Plan your dream trip with personalized itineraries.</p>
            </Container>

            <Container className="text-left mt-4">
                <Row className="justify-content-center">
                    <Col md={3} className="mb-2">
                        <Form.Label className="fst-italic">Travel Days</Form.Label>
                        <Form.Control
                            as="select"
                            className="text-center"
                            value={travelDays}
                            onChange={(e) => setTravelDays(e.target.value)}
                        >
                            <option value="">Choose travel days</option>
                            {[...Array(7)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1} {i === 0 ? "day" : "days"}
                                </option>
                            ))}
                        </Form.Control>
                    </Col>
                    <Col md={3} className="mb-2 position-relative">
                        <Form.Label className="fst-italic">Destination</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Type your destination..."
                            className="text-center"
                            value={destination}
                            onChange={(e) => {
                                setDestination(e.target.value);
                                fetchDestinations(e.target.value);
                            }}
                        />
                        {loadingSuggestions && <Spinner animation="border" size="sm" className="ms-2" />}
                        {suggestions.length > 0 && (
                            <ListGroup className="position-absolute w-100 shadow bg-white">
                                {suggestions.map((city, index) => (
                                    <ListGroup.Item key={index} action onClick={() => handleSelectSuggestion(city)}>
                                        {city}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Col>
                    <Col md={3} className="mb-2">
                        <Form.Label className="fst-italic">Travel Style</Form.Label>
                        <Form.Control
                            as="select"
                            className="text-center"
                            value={travelStyle}
                            onChange={(e) => setTravelStyle(e.target.value)}
                        >
                            <option value="">Choose travel style</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Relax">Relax</option>
                            <option value="Culture">Culture</option>
                        </Form.Control>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Form.Label className="fst-italic">Budget (INR)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter budget in ₹"
                            className="text-center"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row className="justify-content-end mt-3">
                    <Col md={3}>
                        <Button variant="primary" className="w-100 btn-lg py-2 px-4" onClick={handleRunClick}>
                            ✨ Run
                        </Button>
                    </Col>
                </Row>
            </Container>

            <Container className="text-center mt-5">
                <h2 className="fw-bold">Popular Tourist Places in India</h2>
                <Row className="justify-content-center mt-3">
                    {[
                        { name: "Manali", img: "https://www.clubmahindra.com/blog/media/section_images/blog-topic-6530ecb63a76c89.jpg", link: "https://www.google.com/search?q=manali" },
                        { name: "Shimla", img: "https://i0.wp.com/jannattravelguru.com/wp-content/uploads/2021/10/himachal-pradesh-shimla-147616947938o.webp", link: "https://www.google.com/search?q=shimla" },
                        { name: "Goa Beach", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6LzV3PwBVW52b-QcS87Xx2Dohv8_sEr--sA&s", link: "https://www.google.com/search?q=goa+beaches" },
                        { name: "Jaipur", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn9GcRjcT9rS_ezSSzG9PRIRmMSh2zC85tzzurPNQ&s", link: "https://www.google.com/search?q=jaipur" },
                        { name: "Kerala Backwaters", img: "https://miro.medium.com/v2/resize:fit:800/1*MGLoMtfmdM0uWvckntBlOA.png", link: "https://www.google.com/search?q=kerala+backwaters" },
                        { name: "Darjeeling", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn9GcTADtryC1RUa9fkVQ1RqoxJ20bboW6IB3_UUQ&s", link: "https://www.google.com/search?q=darjeeling" },
                    ].map((place, index) => (
                        <Col key={index} md={4} className="mb-3">
                            <Card className="shadow-sm">
                                <a href={place.link} target="_blank" rel="noopener noreferrer">
                                    <Card.Img variant="top" src={place.img} alt={place.name} style={{ height: "200px", objectFit: "cover" }} />
                                </a>
                                <Card.Body>
                                    <Card.Title>{place.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WanderChat />} />
                <Route path="/output" element={<TripOutputPage />} />
            </Routes>
        </Router>
    );
};

export default App;