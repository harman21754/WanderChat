import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const Itinerary = ({ itineraryData }) => {
    const parseItinerary = (data) => {
        const lines = data.split("\n");
        const itineraryItems = [];
        let currentDay = null;
        let budgetSavingTips = [];
        let inBudgetSavingTipsSection = false;

        lines.forEach((line) => {
            line = line.trim();
            line = line.replace(/\*\*/g, "").replace(/\*/g, "").trim();

            if (line.startsWith("##")) {
                line = line.replace("##", "").trim();
                itineraryItems.push({ note: line });
                return;
            }

            if (line.startsWith("Day")) {
                currentDay = line;
                inBudgetSavingTipsSection = false;
                itineraryItems.push({ day: currentDay, activities: [] });
            } else if (line.startsWith("Budget-Saving Tips:") || line.startsWith("Budget Saving Tips:")) {
                currentDay = null;
                budgetSavingTips = [];
                inBudgetSavingTipsSection = true;
            } else if (inBudgetSavingTipsSection && (line.match(/^\d+\./) || line.startsWith("📍"))) {
                budgetSavingTips.push(line.replace("📍", "").trim());
            } else if (line && currentDay && currentDay.startsWith("Day") && !inBudgetSavingTipsSection) {
                itineraryItems[itineraryItems.length - 1].activities.push(line);
            } else if (line && !line.startsWith("N/A") && !line.startsWith("Budget-Saving Tips:") && !line.startsWith("Budget Saving Tips:") && !inBudgetSavingTipsSection) {
                itineraryItems.push({ note: line });
            }
        });

        if (budgetSavingTips.length > 0) {
            itineraryItems.push({ section: "Budget-Saving Tips", details: budgetSavingTips });
        }

        return itineraryItems;
    };

    const itineraryItems = parseItinerary(itineraryData);

    return (
        <div className="mt-4">
            <h2 className="fw-bold mb-4 text-center">Your Itinerary</h2>
            {itineraryItems.map((item, index) => (
                <div key={index} className="mb-4">
                    {item.day && (
                        <Card className="itinerary-section">
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
                    {item.section && (
                        <Card className="itinerary-section">
                            <Card.Header className="bg-budget-tips text-white">
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
                    {item.note && (
                        <Card className="mb-3">
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