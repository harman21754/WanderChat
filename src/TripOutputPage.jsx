import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Card } from "react-bootstrap";

const TripOutputPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { destination, travelDays, travelStyle, budget } = location.state || {};

    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!destination || !travelDays || !travelStyle || !budget) {
            setLoading(false);
            return;
        }

        // Call FastAPI backend to generate itinerary
        fetch("http://127.0.0.1:8000/generate-itinerary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                destination,
                travel_days: travelDays,
                travel_style: travelStyle,
                budget,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setItinerary(data.itinerary);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching itinerary:", error);
                setLoading(false);
            });
    }, [destination, travelDays, travelStyle, budget]);

    return (
        <Container className="text-center mt-5">
            <h1 className="fw-bold">Your Trip Plan</h1>
            <p>Here are the details of your trip:</p>
            <h3>Destination: {destination || "N/A"}</h3>
            <h4>Travel Days: {travelDays || "N/A"}</h4>
            <h4>Travel Style: {travelStyle || "N/A"}</h4>
            <h4>Budget: ₹{budget || "N/A"}</h4>

            <hr />

            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : itinerary ? (
                <Card className="p-3">
                    <h2>Generated Itinerary</h2>
                    <pre className="text-start">{itinerary}</pre>
                </Card>
            ) : (
                <p className="text-danger">No itinerary generated. Try again!</p>
            )}

            <Button variant="secondary" className="mt-3" onClick={() => navigate("/")}>
                🔙 Back to Home
            </Button>
        </Container>
    );
};

export default TripOutputPage;
