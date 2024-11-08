import os
import firebase_admin
from firebase_admin import credentials, db
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

cred = credentials.Certificate(os.getenv('FIREBASE_CREDENTIALS'))
firebase_admin.initialize_app(cred, {
    'databaseURL': os.getenv('FIREBASE_DATABASE_URL')
})

ref = db.reference('/')
turnos = ref.child('turnos')
turn_counter_ref = ref.child('turn_counter')
turno_actual_ref = ref.child('turno_actual')

def queue_turn(name, matricula):
    current_time = datetime.now()
    timestamp = current_time.isoformat()
    current_turn = turn_counter_ref.get() or 0
    new_turn = current_turn + 1
    turn_counter_ref.set(new_turn)
    
    turnos.push({
        'name': name,
        'matricula': matricula,
        'timestamp': timestamp,
        'turn': new_turn
    })
    
def delete_queue():
    turnos.delete()
    turn_counter_ref.set(0)
    turno_actual_ref.delete()
    
def return_sorted():
    try:
        all_data = turnos.get()
        if not all_data:
            return []
        sorted_data = sorted(all_data.items(), key=lambda x: x[1].get('timestamp'))
        return sorted_data
    except Exception as e:
        print(f"Error in return_sorted: {str(e)}")  # Debug log
        raise e

def call_out(turn_id):
    try:
        print(f"Attempting to call out turn {turn_id}")  # Debug log
        turn_data = turnos.child(turn_id).get()
        print(f"Turn data retrieved: {turn_data}")  # Debug log
        
        if turn_data:
            # Set as current turn
            turno_actual_ref.set(turn_data)
            # Remove from waiting queue
            turnos.child(turn_id).delete()
            return True
        print("Turn data not found")  # Debug log
        return False
    except Exception as e:
        print(f"Error in call_out: {str(e)}")  # Debug log
        raise e

def get_current_turn():
    return turno_actual_ref.get()