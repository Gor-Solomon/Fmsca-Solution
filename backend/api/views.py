import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .hos_logic import HOSSimulator
from .log_drawer import generate_daily_logs
import os

class TripCalculatorView(APIView):
    def post(self, request):
        data = request.data
        current_loc = data.get('current_location') # expected "lat,lon" or "address"
        pickup_loc = data.get('pickup_location')
        dropoff_loc = data.get('dropoff_location')
        cycle_used = float(data.get('cycle_used', 0))

        # Helper to geocode if needed
        def get_coords(loc_str):
            if ',' in loc_str:
                try:
                    lat, lon = map(float, loc_str.split(','))
                    return lat, lon
                except:
                    pass
            # Geocode via Nominatim
            url = f"https://nominatim.openstreetmap.org/search?q={loc_str}&format=json&limit=1"
            headers = {'User-Agent': 'FmscaApp/1.0'}
            resp = requests.get(url, headers=headers).json()
            if resp:
                return float(resp[0]['lat']), float(resp[0]['lon'])
            return None, None

        c_lat, c_lon = get_coords(current_loc)
        p_lat, p_lon = get_coords(pickup_loc)
        d_lat, d_lon = get_coords(dropoff_loc)

        if None in [c_lat, p_lat, d_lat]:
            return Response({"error": "Could not geocode one or more locations"}, status=status.HTTP_400_BAD_REQUEST)

        # Get Route 1: Current -> Pickup
        osrm_url1 = f"http://router.project-osrm.org/route/v1/driving/{c_lon},{c_lat};{p_lon},{p_lat}?overview=full&geometries=geojson"
        try:
            resp1 = requests.get(osrm_url1, timeout=10)
            if resp1.status_code != 200:
                return Response({"error": "OSRM Routing API is currently unavailable (Route 1)"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            route1 = resp1.json()
        except Exception as e:
            return Response({"error": f"Routing failed (Route 1): {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Get Route 2: Pickup -> Dropoff
        osrm_url2 = f"http://router.project-osrm.org/route/v1/driving/{p_lon},{p_lat};{d_lon},{d_lat}?overview=full&geometries=geojson"
        try:
            resp2 = requests.get(osrm_url2, timeout=10)
            if resp2.status_code != 200:
                return Response({"error": "OSRM Routing API is currently unavailable (Route 2)"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            route2 = resp2.json()
        except Exception as e:
            return Response({"error": f"Routing failed (Route 2): {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        if route1['code'] != 'Ok' or route2['code'] != 'Ok':
            return Response({"error": "Routing failed"}, status=status.HTTP_400_BAD_REQUEST)

        leg1 = route1['routes'][0]
        leg2 = route2['routes'][0]

        drive_time_1 = leg1['duration'] / 3600.0
        dist_1 = leg1['distance'] * 0.000621371 # meters to miles
        
        drive_time_2 = leg2['duration'] / 3600.0
        dist_2 = leg2['distance'] * 0.000621371

        # HOS Logic
        simulator = HOSSimulator(cycle_used)
        schedule = simulator.run(drive_time_1, dist_1, drive_time_2, dist_2)

        # Metadata for logs
        metadata = {
            'driver_name': data.get('driver_name', 'John Doe'),
            'carrier_name': data.get('carrier_name', 'Spotter Freight'),
            'truck_number': data.get('truck_number', 'TRK-2026')
        }

        # Generate Logs
        template_path = os.path.join(os.getcwd(), 'blank-paper-log.png')
        if not os.path.exists(template_path):
             template_path = os.path.join(os.path.dirname(os.getcwd()), 'blank-paper-log.png')
             
        log_images = generate_daily_logs(schedule, template_path, metadata)

        return Response({
            "schedule": schedule,
            "route_geometry": {
                "leg1": leg1['geometry'],
                "leg2": leg2['geometry']
            },
            "summary": {
                "total_drive_time": drive_time_1 + drive_time_2,
                "total_distance": dist_1 + dist_2
            },
            "log_images": log_images
        })
