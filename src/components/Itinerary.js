import React from "react";
import { Card, ListGroup, Container } from "react-bootstrap";

const Itinerary = ({ itineraryData }) => {
    if (!itineraryData) return <p>Loading...</p>;

    const parseItinerary = (data) => {
        const lines = data.split("\n");
        let days = [];
        let currentDay = null;

        lines.forEach((line) => {
            if (line.startsWith("Day")) {
                if (currentDay) days.push(currentDay);
                currentDay = { title: line, activities: [] };
            } else if (currentDay && line.trim()) {
                currentDay.activities.push(line.trim());
            }
        });
        if (currentDay) days.push(currentDay);

        return days;
    };

    const days = parseItinerary(itineraryData.itinerary);

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Trip Itinerary</h2>
            {days.map((day, index) => (
                <Card key={index} className="mb-4 shadow-sm">
                    <Card.Header className="bg-primary text-white">
                        <h5>{day.title}</h5>
                    </Card.Header>
                    <ListGroup variant="flush">
                        {day.activities.map((activity, idx) => (
                            <ListGroup.Item key={idx}>{activity}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            ))}
        </Container>
    );
};

export default Itinerary;
