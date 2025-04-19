import React from "react";
import { Card } from "react-bootstrap";

const Itinerary = ({ itineraryData }) => {
    const splitLongLines = (text) => {
        return text.split("\n").reduce((acc, line) => {
            if (line.trim()) {
                // Split long lines at natural breaks (e.g., after a period or activity)
                const parts = line.split(/(?<=\.\s)|(?<=[\)\]])\s+/).filter(part => part.trim());
                acc.push(...parts.map(part => part.trim()));
            }
            return acc;
        }, []);
    };

    return (
        <div>
            <h2>Trip Itinerary</h2>
            {itineraryData ? (
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                    {splitLongLines(itineraryData)
                        .filter((line) => line.trim())
                        .map((item, index) => (
                            <Card key={index} className="mb-3 shadow-sm" style={{ border: "none" }}>
                                <Card.Body style={{ wordWrap: "break-word", padding: "1rem", maxWidth: "100%" }}>
                  <span
                      style={{
                          fontWeight: item.startsWith("**") || item.startsWith("#") ? "bold" : "normal",
                          color: item.startsWith("#") ? "#333" : "inherit",
                          display: "block",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                      }}
                      title={item}
                  >
                    {item.replace(/\*\*/g, "")}
                  </span>
                                </Card.Body>
                            </Card>
                        ))}
                </div>
            ) : (
                <p>No itinerary data available.</p>
            )}
        </div>
    );
};

export default Itinerary;