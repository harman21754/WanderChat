from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv
import os
import time

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ItineraryRequest(BaseModel):
    destination: str
    travel_days: int
    travel_style: str
    budget: int

def generate_ai_itinerary(destination, travel_days, travel_style, budget):
    try:
        if travel_days <= 0 or budget <= 0:
            return "Error: Travel days and budget must be positive numbers"
        start_time = time.time()
        model = genai.GenerativeModel("gemini-1.5-pro")
        prompt = f"Generate a detailed {travel_days}-day itinerary for {destination} with a {travel_style} travel style, strictly adhering to a budget of {budget} INR. Provide a specific day-by-day schedule with exact activities, locations, and estimated costs (e.g., 'Day 1: 9:00 AM - Visit Golden Temple, free entry; 12:00 PM - Lunch at Kesar Da Dhaba, ₹300'). Exclude flights and include at least 3 activities per day with timings. End with 3 specific budget-saving tips tailored to this trip."
        response = model.generate_content(prompt)
        end_time = time.time()
        print(f"Gemini API request took {end_time - start_time:.2f} seconds")
        if not response.candidates or not response.candidates[0].content.parts:
            return "Error: Invalid response from Gemini API"
        return response.candidates[0].content.parts[0].text
    except Exception as e:
        return f"Error generating itinerary: {str(e)}"

@app.post("/generate-itinerary")
def generate_itinerary(request: ItineraryRequest):
    start_time = time.time()
    ai_response = generate_ai_itinerary(request.destination, request.travel_days, request.travel_style, request.budget)
    end_time = time.time()
    print(f"Total endpoint processing time: {end_time - start_time:.2f} seconds")
    return {"itinerary": ai_response}

@app.get("/fetch-cities")
async def fetch_cities(namePrefix: str):
    if not namePrefix:
        return {"data": []}

    rapidapi_key = os.getenv("RAPIDAPI_KEY")
    if not rapidapi_key:
        raise HTTPException(status_code=500, detail="RapidAPI key is not set in environment variables")

    url = f"https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix={namePrefix}&countryIds=IN&limit=5"
    headers = {
        "X-RapidAPI-Key": rapidapi_key,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
    }
    async with httpx.AsyncClient() as client:
        try:
            start_time = time.time()
            response = await client.get(url, headers=headers)
            end_time = time.time()
            print(f"RapidAPI request took {end_time - start_time:.2f} seconds")
            response.raise_for_status()
            data = response.json()
            if "data" not in data:
                print(f"Unexpected response format: {data}")
                return {"data": []}
            formatted_data = [{"city": item["city"]} for item in data["data"] if "city" in item]
            return {"data": formatted_data}
        except Exception as e:
            print(f"Error fetching cities: {str(e)}")
            return {"data": []}