from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key="AIzaSyCR6DZZqcnL_lv6v0miw45sPDeGAwB_7UU")

class ItineraryRequest(BaseModel):
    destination: str
    travel_days: int
    travel_style: str
    budget: int

def generate_ai_itinerary(destination, travel_days, travel_style, budget):
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        prompt = f"Generate a detailed {travel_days}-day itinerary for {destination} with a {travel_style} travel style, strictly adhering to a budget of {budget}. Provide a specific day-by-day schedule with exact activities, locations, and estimated costs (e.g., 'Day 1: 9:00 AM - Visit Golden Temple, free entry; 12:00 PM - Lunch at Kesar Da Dhaba, ₹300'). Exclude flights and include at least 3 activities per day with timings. End with 3 specific budget-saving tips tailored to this trip."
        response = model.generate_content(prompt)
        print(f"Full response: {response}")
        if response.candidates and len(response.candidates) > 0:
            candidate = response.candidates[0]
            if hasattr(candidate, 'content') and candidate.content.parts:
                return candidate.content.parts[0].text
            else:
                return "Error: No content parts in candidate"
        else:
            return "Error: No candidates returned from Gemini API"
    except Exception as e:
        print(f"Error in generate_ai_itinerary: {e}")
        return f"Error generating itinerary: {str(e)}"

@app.post("/generate-itinerary")
def generate_itinerary(request: ItineraryRequest):
    ai_response = generate_ai_itinerary(request.destination, request.travel_days, request.travel_style, request.budget)
    print(f"Generated itinerary: {ai_response}")
    return {"itinerary": ai_response}