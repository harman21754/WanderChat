import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Navbar, Button, Spinner, Card, Row, Col } from "react-bootstrap";
import Itinerary from "./components/Itinerary.js";
import "./TripOutputPage.css";

const TripOutputPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { destination, travelDays, travelStyle, budget } = location.state || {};

    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!destination || !travelDays || !travelStyle || !budget) {
            setError("Missing input data. Please fill all fields.");
            setLoading(false);
            return;
        }

        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            console.log("Fetch request timed out after 30 seconds");
        }, 30000);
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

        fetch(`${backendUrl}/generate-itinerary`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destination, travel_days: travelDays, travel_style: travelStyle, budget }),
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Backend response:", data);
                setItinerary(data.itinerary || "No itinerary data received.");
                setLoading(false);
            })
            .catch((error) => {
                console.error("Fetch error:", error.message);
                setItinerary(`Day 1: Arrival in ${destination}\n9:00 AM: Arrive and check in.\nDay 2: Exploration\n9:00 AM: Visit a local landmark.\nDay 3: Departure\n9:00 AM: Depart from ${destination}.`);
                setError(`Unable to fetch itinerary: ${error.message}. Using fallback data.`);
                setLoading(false);
            })
            .finally(() => clearTimeout(timeoutId));
    }, [destination, travelDays, travelStyle, budget]);

    return (
        <>
            <Navbar bg="dark" expand="lg" className="shadow-sm p-3">
                <Container>
                    <Navbar.Brand href="/" className="fw-bold fs-4 text-white">
                        WanderChat
                    </Navbar.Brand>
                </Container>
            </Navbar>

            <div
                className="output-page"
                style={{
                    backgroundImage: `url(https://source.unsplash.com/1600x900/?${destination},travel)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                    position: "relative",
                }}
            >
                <div className="content-overlay" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", minHeight: "100vh", padding: "40px 0" }}>
                    <Container className="text-center py-5">
                        <h1 className="fw-bold text-white display-4">Explore {destination || "N/A"}</h1>
                        <p className="text-white lead">Your personalized {travelDays || "N/A"}-day trip awaits!</p>

                        <Card className="mt-4 bg-light bg-opacity-90 p-4 shadow-sm">
                            <Card.Body>
                                <h3 className="fw-bold">Trip Details</h3>
                                <Row className="text-start mt-3">
                                    <Col md={6}>
                                        <p><strong>Destination:</strong> {destination || "N/A"}</p>
                                        <p><strong>Travel Days:</strong> {travelDays || "N/A"}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Travel Style:</strong> {travelStyle || "N/A"}</p>
                                        <p><strong>Budget:</strong> ₹{budget || "N/A"}</p>
                                    </Col>
                                </Row>
                                <hr />
                                {loading ? (
                                    <div className="d-flex flex-column align-items-center mt-4">
                                        <Spinner animation="border" role="status" variant="primary" />
                                        <p className="text-muted mt-3">Generating your itinerary...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-warning mt-4">
                                        <p className="fst-italic">{error}</p>
                                        <Itinerary itineraryData={itinerary} />
                                    </div>
                                ) : itinerary ? (
                                    <Itinerary itineraryData={itinerary} />
                                ) : (
                                    <p className="text-danger mt-4">No itinerary generated. Please try again!</p>
                                )}
                            </Card.Body>
                        </Card>

                        <Button
                            variant="primary"
                            className="mt-4 px-4 py-2"
                            onClick={() => navigate("/")}
                        >
                            🔙 Back to Home
                        </Button>
                    </Container>
                </div>
            </div>
        </>
    );
};

export default TripOutputPage;