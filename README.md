# FMCSA HOS Route Planner & Log Generator

This project is a full-stack application built with **Django (Backend)** and **React (Frontend)** to calculate trip routes based on Federal Motor Carrier Safety Administration (FMCSA) Hours of Service (HOS) rules.

## Features
- **Route Calculation:** Uses OSRM for distance and drive time.
- **HOS Logic:** Implements 11-hour driving limit, 14-hour window, 30-minute breaks, and 10-hour resets.
- **Log Generation:** Programmatically draws driver log sheets using Python Pillow.
- **Interactive Map:** Displays the route using React-Leaflet and OpenStreetMap.

## Local Setup

### Backend (Django)
1. Navigate to the `backend` folder.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows).
4. Install dependencies: `pip install -r requirements.txt`
5. Run migrations: `python manage.py migrate`
6. Start the server: `python manage.py runserver`

### Frontend (React)
1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open `http://localhost:5173` in your browser.

## Vercel Deployment

This project is configured for Vercel using the root `vercel.json`.

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the root directory.
3. Follow the prompts to deploy.

The configuration handles:
- Routing `/api/*` to the Django backend.
- Building the React frontend and serving it as static files.
- Installing Python dependencies during the build phase.

## Dependencies
- Backend: `Django`, `djangorestframework`, `pillow`, `requests`, `django-cors-headers`
- Frontend: `React`, `Leaflet`, `Axios`, `Tailwind CSS`
