import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, Spinner } from "react-bootstrap";
import Itinerary from "./components/Itinerary.js";

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
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                console.log("Backend response:", data); // Log the full response
                setItinerary(data.itinerary ? data.itinerary : data); // Handle both cases
                setLoading(false);
            })
            .catch((error) => {
                console.error("Fetch error:", error); // Log the error
                setError("Could not generate itinerary. Please try again or check the backend.");
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
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : itinerary ? (
                <Itinerary itineraryData={itinerary} />
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