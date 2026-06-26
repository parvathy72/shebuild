from flask import Blueprint, request, jsonify
from config.firebase import db

user_bp = Blueprint('user', __name__)

@user_bp.route('/<uid>', methods=['GET'])
def get_user(uid):
    try:
        user_data = db.child('users').child(uid).get().val()
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'success': True, 'user': dict(user_data)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<uid>', methods=['PUT'])
def update_user(uid):
    try:
        data = request.json
        db.child('users').child(uid).update(data)
        return jsonify({'success': True, 'message': 'Profile updated'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<uid>/progress', methods=['GET'])
def get_progress(uid):
    try:
        user_data = db.child('users').child(uid).get().val() or {}
        return jsonify({
            'readinessScore': user_data.get('readinessScore', 0),
            'confidenceScore': user_data.get('confidenceScore', 0)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
