# WanderChat

WanderChat is a web application that helps users plan personalized travel itineraries. Users can input their destination, travel days, travel style, and budget to generate a detailed itinerary using the Gemini API. The app also provides city suggestions for destinations in India using the RapidAPI GeoDB Cities API. The frontend is built with React, and the backend is powered by FastAPI.

## Features
- **Personalized Itineraries**: Generate detailed travel itineraries based on destination, travel days, travel style, and budget.
- **City Suggestions**: Autocomplete city suggestions for destinations in India while typing.
- **Responsive Design**: User-friendly interface built with React and styled with Bootstrap.
- **Budget-Saving Tips**: Itineraries include tailored budget-saving tips for your trip.
- **Fallback Itineraries**: Provides a fallback itinerary if the API request fails.

## Tech Stack
- **Frontend**: React, React Router, React Bootstrap
- **Backend**: FastAPI, Python
- **APIs**:
  - Gemini API (for generating itineraries)
  - RapidAPI GeoDB Cities API (for city suggestions)
- **Environment**: Node.js (frontend), Python (backend)

## Project Structure
```
WanderChat/
├── backend/              # FastAPI backend
│   ├── main.py           # Backend server and API endpoints
│   └── venv/             # Python virtual environment (ignored by Git)
├── src/                  # React frontend
│   ├── components/       # React components
│   │   ├── Itinerary.js  # Component to parse and display itineraries
│   │   ├── TripOutputPage.jsx  # Page to display the generated itinerary
│   │   └── TripOutputPage.css  # Styles for TripOutputPage
│   ├── App.js            # Main React app with user input form and routing
│   └── index.js          # React entry point
├── public/               # Static files for React
│   └── index.html        # HTML template
├── build/                # React build output (ignored by Git)
├── node_modules/         # Node.js dependencies (ignored by Git)
├── .gitignore            # Git ignore file
├── package.json          # Node.js dependencies and scripts
└── package-lock.json     # Dependency lock file
```

## Prerequisites
- **Node.js** (v14 or higher) and npm
- **Python** (v3.8 or higher) and pip
- **Git**
- API keys for:
  - Gemini API (for itinerary generation)
  - RapidAPI GeoDB Cities API (for city suggestions)

## Setup Instructions

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/harman21754/WanderChat.git
cd WanderChat
```

### 2. Set Up the Frontend
1. Install frontend dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory (`WanderChat/`) with the following:
   ```
   REACT_APP_BACKEND_URL=http://127.0.0.1:8000
   ```
   This specifies the URL of the backend server.

### 3. Set Up the Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a Python virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install backend dependencies:
   ```bash
   pip install fastapi uvicorn pydantic google-generativeai httpx python-dotenv
   ```
4. Create a `.env` file in the `backend/` directory (`WanderChat/backend/`) with your API keys:
   ```
   GEMINI_API_KEY=<your-gemini-api-key>
   RAPIDAPI_KEY=<your-rapidapi-key>
   ```
   Replace `<your-gemini-api-key>` and `<your-rapidapi-key>` with your actual API keys.

### 4. Run the Backend
- Start the FastAPI server:
  ```bash
  uvicorn main:app --reload --port 8000
  ```
- The backend should now be running at `http://127.0.0.1:8000`.

### 5. Run the Frontend
- In a new terminal, navigate to the root directory (`WanderChat/`) and start the React app:
  ```bash
  npm start
  ```
- The frontend should open in your browser at `http://localhost:3000`.

## Usage
1. On the homepage (`http://localhost:3000`), enter your travel preferences:
   - **Destination**: Start typing a city name (e.g., "Amritsar") to see suggestions (limited to India).
   - **Travel Days**: Select the number of days for your trip (1 to 7).
   - **Travel Style**: Choose a style (Adventure, Relax, Culture).
   - **Budget**: Enter your budget in INR (e.g., 5000).
2. Click the **Run** button to generate your itinerary.
3. You’ll be redirected to the output page (`/output`) where your itinerary will be displayed, including a day-by-day schedule and budget-saving tips.
4. If the itinerary generation fails, a fallback itinerary will be shown.

## Example
- **Input**:
  - Destination: Amritsar
  - Travel Days: 3
  - Travel Style: Culture
  - Budget: ₹5000
- **Output**:
  - A 3-day itinerary for Amritsar with cultural activities (e.g., visiting the Golden Temple) and estimated costs, plus budget-saving tips.

## Troubleshooting
- **Backend Not Running**: Ensure the FastAPI server is running on port 8000 (`uvicorn main:app --reload --port 8000`).
- **API Errors**:
  - If you see errors related to the Gemini API or RapidAPI, check your API keys in `backend/.env` and ensure they are valid.
  - You may need to rotate your API keys if they were previously exposed in the repository (see Security Notes below).
- **No City Suggestions**: Verify that the RapidAPI key is correct and that the backend is running.
- **Itinerary Not Loading**: Check the browser console for errors. Ensure the backend URL in `.env` matches the port where the backend is running.

## Security Notes
- **API Keys**: The `.env` files containing API keys were previously committed to the repository, which is a security risk. They have been removed from tracking, but you should rotate your API keys:
  - Generate a new Gemini API key in Google Cloud Console.
  - Generate a new RapidAPI key in your RapidAPI account.
  - Update your local `backend/.env` file with the new keys.
- **Git History**: Sensitive data may still exist in your Git history. Consider rewriting the history using `git filter-repo` or creating a new repository if necessary.

## Deployment
To deploy WanderChat, you’ll need to:
1. Deploy the backend (e.g., on Render, Heroku, or a VPS):
   - Set the environment variables (`GEMINI_API_KEY`, `RAPIDAPI_KEY`) in the deployment platform’s settings.
   - Run the FastAPI server (e.g., `uvicorn main:app --host 0.0.0.0 --port $PORT`).
2. Deploy the frontend (e.g., on Netlify, Vercel, or Render):
   - Build the React app: `npm run build`.
   - Set the `REACT_APP_BACKEND_URL` environment variable to the deployed backend URL.
   - Deploy the contents of the `build/` directory.

## Contributing
Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License.

## Contact
For questions or feedback, please open an issue on the GitHub repository.