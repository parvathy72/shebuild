from flask import Blueprint, request, jsonify
from config.firebase import db
from datetime import datetime
import uuid

peer_bp = Blueprint('peer', __name__)

@peer_bp.route('/posts', methods=['GET'])
def get_posts():
    try:
        all_posts = db.child('posts').get().val()
        
        if not all_posts:
            return jsonify({'success': True, 'posts': []})
        
        posts = []
        for post_id, post_data in all_posts.items():
            posts.append({'id': post_id, **dict(post_data)})
        
        posts.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        posts = posts[:20]
        
        return jsonify({'success': True, 'posts': posts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@peer_bp.route('/posts', methods=['POST'])
def create_post():
    try:
        data = request.json
        post_data = {
            'content': data.get('content'),
            'userId': data.get('userId', 'anonymous'),
            'createdAt': datetime.now().isoformat()
        }
        post_id = str(uuid.uuid4())
        db.child('posts').child(post_id).set(post_data)
        return jsonify({'success': True, 'id': post_id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@peer_bp.route('/report', methods=['POST'])
def report_post():
    try:
        data = request.json
        report_data = {
            'postId': data.get('postId'),
            'reason': data.get('reason'),
            'createdAt': datetime.now().isoformat()
        }
        report_id = str(uuid.uuid4())
        db.child('reports').child(report_id).set(report_data)
        return jsonify({'success': True, 'message': 'Report submitted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
