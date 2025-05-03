import React from "react";
import { Card, ListGroup, Row, Col } from "react-bootstrap";

const Itinerary = ({ itineraryData }) => {
    // Parse the itinerary data and clean up Markdown formatting
    const parseItinerary = (data) => {
        const lines = data.split("\n");
        const itineraryItems = [];
        let currentDay = null;
        let budgetSavingTips = [];
        let inBudgetSavingTipsSection = false;

        lines.forEach((line, index) => {
            line = line.trim();

            // Remove Markdown bold (**text**) and list markers (*)
            line = line.replace(/\*\*/g, "").replace(/\*/g, "").trim();

            // Remove ## from the itinerary title (e.g., ## 3-Day Amritsar Cultural Immersion)
            if (line.startsWith("##")) {
                line = line.replace("##", "").trim();
                itineraryItems.push({ note: line });
                return;
            }

            // Check for day headings (e.g., "Day 1: ...")
            if (line.startsWith("Day")) {
                currentDay = line;
                inBudgetSavingTipsSection = false; // Reset section flag
                itineraryItems.push({ day: currentDay, activities: [] });
            }
            // Check for Budget Saving Tips
            else if (line.startsWith("Budget Saving Tips:")) {
                currentDay = null; // Reset current day to avoid confusion with day activities
                budgetSavingTips = []; // Reset budget saving tips
                inBudgetSavingTipsSection = true; // Mark that we're in the Budget Saving Tips section
            }
            // Check for numbered tips under Budget Saving Tips
            else if (inBudgetSavingTipsSection && line.match(/^\d+\./)) {
                budgetSavingTips.push(line);
            }
            // Add activities under the current day
            else if (line && currentDay && currentDay.startsWith("Day") && !inBudgetSavingTipsSection) {
                itineraryItems[itineraryItems.length - 1].activities.push(line);
            }
            // Handle general notes or sections
            else if (line && !line.startsWith("N/A") && !line.startsWith("Budget Saving Tips:") && !inBudgetSavingTipsSection) {
                itineraryItems.push({ note: line });
            }
        });

        // Add Budget Saving Tips as a separate section if they exist
        if (budgetSavingTips.length > 0) {
            itineraryItems.push({ section: "Budget Saving Tips:", details: budgetSavingTips });
        }

        return itineraryItems;
    };

    const itineraryItems = parseItinerary(itineraryData);

    return (
        <div className="mt-4">
            <h2 className="fw-bold mb-4 text-center">Your Itinerary</h2>
            {itineraryItems.map((item, index) => (
                <div key={index} className="mb-4">
                    {/* Day Section */}
                    {item.day && (
                        <Card className="shadow-sm mb-3">
                            <Card.Header className="bg-primary text-white">
                                <h4 className="mb-0">{item.day}</h4>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {item.activities.map((activity, idx) => (
                                    <ListGroup.Item key={idx} className="d-flex align-items-start">
                                        <span className="me-3" style={{ fontSize: "1.5em" }}>📍</span>
                                        <span>{activity}</span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    )}
                    {/* Budget Saving Tips Section */}
                    {item.section && (
                        <Card className="shadow-sm mb-3">
                            <Card.Header className="bg-success text-white">
                                <h4 className="mb-0">{item.section}</h4>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {item.details.map((detail, idx) => (
                                    <ListGroup.Item key={idx} className="d-flex align-items-start">
                                        <span className="me-3" style={{ fontSize: "1.5em" }}>📍</span>
                                        <span>{detail}</span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    )}
                    {/* General Notes */}
                    {item.note && (
                        <Card className="shadow-sm mb-3">
                            <Card.Body>
                                <p className="mb-0">{item.note}</p>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Itinerary;