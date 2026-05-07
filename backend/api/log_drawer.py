from PIL import Image, ImageDraw, ImageFont
import datetime
import os
import base64
from io import BytesIO

class LogDrawer:
    def __init__(self, template_path):
        self.template_path = template_path
        # Grid parameters (Calibrated for standard FMCSA log sheet)
        self.grid_left = 0.13
        self.grid_right = 0.95
        self.grid_top = 0.32
        self.grid_bottom = 0.52
        
        self.rows = {
            'Off Duty': 0,
            'Sleeper Berth': 1,
            'Driving': 2,
            'On Duty (Not Driving)': 3
        }
        
        # Robust Percentage-based Field Mapping (X%, Y%)
        # These are calibrated for standard FMCSA log book layouts
        self.field_map = {
            'date': (0.36, 0.015),
            'driver_name': (0.35, 0.068),
            'carrier_name': (0.65, 0.130),
            'truck_number': (0.55, 0.130),
            'total_miles': (0.80, 0.130),
            'signature': (0.80, 0.975)
        }

    def draw_log(self, daily_schedule, day_date, metadata):
        img = Image.open(self.template_path).convert('RGB')
        draw = ImageDraw.Draw(img)
        w, h = img.size
        
        print(f"--- Drawing text on image ({w}x{h}) for date: {day_date} ---")
        
        # Load font with dynamic sizing based on image resolution
        try:
            # Try to load a bold font if possible
            font_path = "arial.ttf" if os.name == 'nt' else "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
            base_size = int(h * 0.02) # ~2% of height
            font = ImageFont.truetype(font_path, base_size)
            small_font = ImageFont.truetype(font_path, int(base_size * 0.8))
        except:
            font = ImageFont.load_default()
            small_font = ImageFont.load_default()

        # 1. Fill Header Fields (Percentage-based placement)
        def draw_field(field_name, text):
            px, py = self.field_map.get(field_name, (0,0))
            draw.text((px * w, py * h), str(text), fill=(0, 0, 0), font=font)

        draw_field('date', day_date.strftime('%m        %d          %Y'))
        draw_field('driver_name', metadata.get('driver_name', ''))
        draw_field('carrier_name', metadata.get('carrier_name', ''))
        draw_field('truck_number', metadata.get('truck_number', ''))
        draw_field('signature', metadata.get('driver_name', ''))
        
        daily_miles = sum(e.get('miles', 0) for e in daily_schedule if e['status'] == 'Driving')
        draw_field('total_miles', f"{int(daily_miles)}")

        # 2. Draw HOS Grid
        gl, gr, gt, gb = self.grid_left * w, self.grid_right * w, self.grid_top * h, self.grid_bottom * h
        row_height = (gb - gt) / 4
        hour_width = (gr - gl) / 24
        
        row_totals = [0.0] * 4

        def get_coords(time_str, status):
            dt = datetime.datetime.fromisoformat(time_str)
            midnight = datetime.datetime.combine(day_date, datetime.time.min)
            hrs = (dt - midnight).total_seconds() / 3600.0
            hrs = max(0, min(24, hrs))
            x = gl + (hrs * hour_width)
            y = gt + (self.rows.get(status, 0) * row_height) + (row_height / 2)
            return x, y

        for i, event in enumerate(daily_schedule):
            start_x, start_y = get_coords(event['start'], event['status'])
            end_x, end_y = get_coords(event['end'], event['status'])
            
            # Sum totals
            duration = (min(datetime.datetime.fromisoformat(event['end']), datetime.datetime.combine(day_date, datetime.time.min) + datetime.timedelta(days=1)) - \
                       max(datetime.datetime.fromisoformat(event['start']), datetime.datetime.combine(day_date, datetime.time.min))).total_seconds() / 3600.0
            if duration > 0:
                row_totals[self.rows.get(event['status'], 0)] += duration
            
            draw.line([(start_x, start_y), (end_x, start_y)], fill='#2563eb', width=4)
            if i < len(daily_schedule) - 1:
                next_x, next_y = get_coords(daily_schedule[i+1]['start'], daily_schedule[i+1]['status'])
                draw.line([(end_x, start_y), (next_x, next_y)], fill='#2563eb', width=4)

        # 3. Write row totals
        for idx, total in enumerate(row_totals):
            tx, ty = (self.grid_right - 0.03) * w, gt + (idx * row_height) + (row_height )
            draw.text((tx, ty), f"{total:.1f}", fill=(0, 0, 255), font=small_font)

        draw.text(((self.grid_right + 0.01) * w, gb + 5), f"Total: {sum(row_totals):.1f}", fill=(0,0,0), font=small_font)

        buffered = BytesIO()
        img.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode()

def generate_daily_logs(schedule, template_path, metadata):
    days = {}
    for event in schedule:
        d = datetime.datetime.fromisoformat(event['start']).date()
        if d not in days: days[d] = []
        days[d].append(event)
        ed = datetime.datetime.fromisoformat(event['end']).date()
        if ed > d:
            if ed not in days: days[ed] = []
            days[ed].append(event)
    
    drawer = LogDrawer(template_path)
    return [{'date': d.isoformat(), 'image': drawer.draw_log(days[d], d, metadata)} for d in sorted(days.keys())]
