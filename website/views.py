from flask import render_template, Blueprint, request, flash
from . import db

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        name = request.form.get('name')
        matricula = request.form.get('userId')
        db.queue_turn(name, matricula)
        turno = db.turn_counter_ref.get()
    return render_template("customer.html", turno=turno)

@views.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template("staff.html")