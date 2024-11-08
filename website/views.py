from flask import render_template, Blueprint, request, flash, jsonify
from . import db

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    turno = None
    if request.method == 'POST':
        try:
            name = request.form.get('name')
            matricula = request.form.get('userId')
            db.queue_turn(name, matricula)
            turno = db.turn_counter_ref.get()
            flash('Turn number assigned successfully!', 'success')
        except Exception as e:
            flash('Error assigning turn number. Please try again.', 'error')
    return render_template("customer.html", turno=turno)

@views.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'reset':
            db.delete_queue()
            flash('Queue reset', 'success')
    
    current_turn = db.get_current_turn()
    return render_template("staff.html", current_turn=current_turn)

@views.route('/api/queue-data')
def get_queue_data():
    # Get waiting queue data
    sorted_data = db.return_sorted()
    queue_data = []
    for key, value in sorted_data:
        queue_data.append({
            'id': key,
            'name': value['name'],
            'matricula': value['matricula'],
            'turn': value['turn'],
            'timestamp': value['timestamp']
        })
    
    # Get current turn data
    current_turn = db.get_current_turn()
    
    return jsonify({
        'queue': queue_data,
        'currentTurn': current_turn
    })

@views.route('/api/move-to-current', methods=['POST'])
def move_to_current():
    try:
        data = request.get_json()
        print('Received data:', data)  # Debug log
        
        if not data or 'turnId' not in data:
            print('No turnId in request')  # Debug log
            return jsonify({'success': False, 'error': 'No turn ID provided'}), 400
        
        turn_id = data['turnId']
        print('Processing turn_id:', turn_id)  # Debug log
        
        # Call the database function
        success = db.call_out(turn_id)
        print('call_out result:', success)  # Debug log
        
        if success:
            return jsonify({'success': True})
        return jsonify({'success': False, 'error': 'Turn not found'}), 404
        
    except Exception as e:
        print('Error in move_to_current:', str(e))  # Debug log
        return jsonify({'success': False, 'error': str(e)}), 500

@views.route('/display')
def display():
    return render_template("display.html")

