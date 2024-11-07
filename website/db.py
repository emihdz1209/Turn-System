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