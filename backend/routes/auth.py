from flask import Blueprint, request, jsonify
from config.firebase import auth, db
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('fullName')
        
        user = auth.create_user_with_email_and_password(email, password)
        uid = user['localId']
        
        user_data = {
            'fullName': full_name,
            'email': email,
            'industry': data.get('industry'),
            'prevRole': data.get('prevRole'),
            'breakDuration': data.get('breakDuration'),
            'targetRole': data.get('targetRole'),
            'workPref': data.get('workPref'),
            'createdAt': datetime.now().isoformat(),
            'readinessScore': 0,
            'confidenceScore': 0
        }
        
        db.child('users').child(uid).set(user_data, user['idToken'])
        
        return jsonify({'success': True, 'uid': uid, 'message': 'Account created successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        user = auth.sign_in_with_email_and_password(email, password)
        uid = user['localId']
        
        user_data = db.child('users').child(uid).get(user['idToken']).val()
        return jsonify({'success': True, 'uid': uid, 'user': dict(user_data) if user_data else {}})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    try:
        data = request.json
        token = data.get('token')
        account_info = auth.get_account_info(token)
        uid = account_info['users'][0]['localId']
        
        return jsonify({'success': True, 'uid': uid})
    except Exception as e:
        return jsonify({'success': False, 'error': 'Invalid token'}), 401
