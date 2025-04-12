from fastapi import FastAPI
from pydantic import BaseModel
import json
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware




# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Configure Google Gemini API
genai.configure(api_key="AIzaSyCR6DZZqcnL_lv6v0miw45sPDeGAwB_7UU")

# Request model for itinerary generation
class ItineraryRequest(BaseModel):
    destination: str
    travel_days: int
    travel_style: str
    budget: int

# Function to generate an AI-powered itinerary
def generate_ai_itinerary(destination, travel_days, travel_style, budget):
    model = genai.GenerativeModel("gemini-1.5-pro")

    prompt = f"Generate a {travel_days}-day itinerary for {destination} with a {travel_style} travel style under a budget of {budget}."

    response = model.generate_content(prompt)  # Correct method
    return response.candidates[0]['text'] if response.candidates else "Error generating itinerary"

# API endpoint for AI-powered itinerary generation
@app.post("/generate-itinerary")
def generate_itinerary(request: ItineraryRequest):
    ai_response = generate_ai_itinerary(request.destination, request.travel_days, request.travel_style, request.budget)

    return {"itinerary": ai_response}