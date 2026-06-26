from flask import Blueprint, request, jsonify
from config.firebase import db
from datetime import datetime
import uuid

mentors_bp = Blueprint('mentors', __name__)

@mentors_bp.route('/', methods=['GET'])
def get_mentors():
    try:
        industry = request.args.get('industry')
        
        all_mentors = db.child('mentors').get().val()
        
        if not all_mentors:
            return jsonify({'success': True, 'mentors': []})
        
        mentors = []
        for mentor_id, mentor_data in all_mentors.items():
            if industry and mentor_data.get('industry') != industry:
                continue
            mentors.append({'id': mentor_id, **dict(mentor_data)})
        
        return jsonify({'success': True, 'mentors': mentors})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mentors_bp.route('/', methods=['POST'])
def create_mentor():
    try:
        data = request.json
        data['createdAt'] = datetime.now().isoformat()
        mentor_id = str(uuid.uuid4())
        db.child('mentors').child(mentor_id).set(data)
        return jsonify({'success': True, 'id': mentor_id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
