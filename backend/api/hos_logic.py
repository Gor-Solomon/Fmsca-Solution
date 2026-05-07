import datetime

class HOSSimulator:
    def __init__(self, current_cycle_used_hrs):
        self.cycle_remaining = 70.0 - current_cycle_used_hrs
        self.driving_limit = 11.0
        self.duty_window = 14.0
        self.break_limit = 8.0
        
        self.current_driving_time = 0.0
        self.current_duty_window_time = 0.0
        self.cumulative_driving_since_break = 0.0
        
        self.schedule = []
        self.current_time = datetime.datetime(2026, 5, 7, 8, 0) # Start at 8 AM
        self.total_miles = 0.0
        self.miles_since_fuel = 0.0

    def add_event(self, status, duration_hrs, miles=0.0):
        start_time = self.current_time
        self.current_time += datetime.timedelta(hours=duration_hrs)
        self.schedule.append({
            'status': status,
            'start': start_time.isoformat(),
            'end': self.current_time.isoformat(),
            'duration': duration_hrs,
            'miles': miles
        })
        
        if status == 'Driving':
            self.current_driving_time += duration_hrs
            self.cumulative_driving_since_break += duration_hrs
            self.current_duty_window_time += duration_hrs
            self.cycle_remaining -= duration_hrs
            self.total_miles += miles
            self.miles_since_fuel += miles
        elif status == 'On Duty (Not Driving)':
            self.current_duty_window_time += duration_hrs
            self.cycle_remaining -= duration_hrs
        elif status in ['Off Duty', 'Sleeper Berth']:
            if duration_hrs >= 34.0:
                self.cycle_remaining = 70.0
                self.reset_counters()
            elif duration_hrs >= 10.0:
                self.reset_counters()
            elif duration_hrs >= 0.5:
                self.cumulative_driving_since_break = 0.0

    def reset_counters(self):
        self.current_driving_time = 0.0
        self.current_duty_window_time = 0.0
        self.cumulative_driving_since_break = 0.0

    def simulate_driving(self, total_drive_time, total_dist):
        remaining_drive_time = total_drive_time
        avg_speed = total_dist / total_drive_time if total_drive_time > 0 else 60
        
        while remaining_drive_time > 0:
            # Check for 30-min break
            if self.cumulative_driving_since_break >= 8.0:
                self.add_event('Off Duty', 0.5)
                continue
            
            # Check for fueling
            if self.miles_since_fuel >= 1000:
                if self.cycle_remaining < 0.5:
                    self.add_event('Off Duty', 34.0)
                else:
                    self.add_event('On Duty (Not Driving)', 0.5)
                self.miles_since_fuel = 0
                continue

            # Check limits
            drive_avail = self.driving_limit - self.current_driving_time
            window_avail = self.duty_window - self.current_duty_window_time
            break_avail = self.break_limit - self.cumulative_driving_since_break
            cycle_avail = self.cycle_remaining
            
            can_drive = min(drive_avail, window_avail, break_avail, cycle_avail, remaining_drive_time)
            
            if can_drive <= 0:
                if cycle_avail <= 0:
                    self.add_event('Off Duty', 34.0)
                else:
                    self.add_event('Sleeper Berth', 10.0)
                continue
            
            dist_segment = can_drive * avg_speed
            self.add_event('Driving', can_drive, dist_segment)
            remaining_drive_time -= can_drive

    def run(self, drive_time_1, dist_1, drive_time_2, dist_2):
        # 0. Immediate 34-hour restart if starting with 0 remaining hours
        if self.cycle_remaining <= 0:
            self.add_event('Off Duty', 34.0)

        # 1. Drive to Pickup
        self.simulate_driving(drive_time_1, dist_1)
        
        # 2. Pickup (1 hour On Duty)
        if self.cycle_remaining < 1.0:
            self.add_event('Off Duty', 34.0)
        
        if self.current_duty_window_time + 1.0 > self.duty_window:
            self.add_event('Sleeper Berth', 10.0)
        
        self.add_event('On Duty (Not Driving)', 1.0)
        
        # 3. Drive to Dropoff
        self.simulate_driving(drive_time_2, dist_2)
        
        # 4. Dropoff (1 hour On Duty)
        if self.cycle_remaining < 1.0:
            self.add_event('Off Duty', 34.0)
            
        if self.current_duty_window_time + 1.0 > self.duty_window:
            self.add_event('Sleeper Berth', 10.0)
            
        self.add_event('On Duty (Not Driving)', 1.0)
        
        return self.schedule
