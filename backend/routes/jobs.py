from flask import Blueprint, request, jsonify
from config.firebase import db
from datetime import datetime
import uuid

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/', methods=['GET'])
def get_jobs():
    try:
        mode = request.args.get('mode')
        job_type = request.args.get('type')
        
        all_jobs = db.child('jobs').get().val()
        
        if not all_jobs:
            return jsonify({'success': True, 'jobs': []})
        
        jobs = []
        for job_id, job_data in all_jobs.items():
            if mode and job_data.get('mode') != mode:
                continue
            if job_type and job_data.get('type') != job_type:
                continue
            jobs.append({'id': job_id, **dict(job_data)})
        
        return jsonify({'success': True, 'jobs': jobs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/', methods=['POST'])
def create_job():
    try:
        data = request.json
        data['createdAt'] = datetime.now().isoformat()
        job_id = str(uuid.uuid4())
        db.child('jobs').child(job_id).set(data)
        return jsonify({'success': True, 'id': job_id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
