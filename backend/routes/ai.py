from flask import Blueprint, request, jsonify
import requests
import os

ai_bp = Blueprint('ai', __name__)

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

def call_groq_api(prompt, model='llama-3.3-70b-versatile'):
    try:
        headers = {
            'Authorization': f'Bearer {GROQ_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': model,
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': 0.7,
            'max_tokens': 500
        }
        
        response = requests.post(GROQ_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f'Groq API Error: {str(e)}')
        raise Exception('AI service unavailable')

@ai_bp.route('/resume-gap', methods=['POST'])
def resume_gap():
    try:
        data = request.json
        prev_role = data.get('prevRole')
        break_duration = data.get('breakDuration')
        reason = data.get('reason')
        uid = data.get('uid')
        
        prompt = f"""Reframe this career break positively for a resume: 
Previous role: {prev_role}
Break duration: {break_duration}
Reason: {reason}

Write a professional, empowering 2-3 sentence statement highlighting transferable skills gained during the break. Focus on growth, resilience, and readiness to return."""
        
        result = call_groq_api(prompt)
        
        # Update readiness score
        if uid:
            from config.firebase import db
            user_data = db.child('users').child(uid).get().val()
            if user_data:
                new_score = min(100, user_data.get('readinessScore', 0) + 10)
                db.child('users').child(uid).update({'readinessScore': new_score}, None)
        
        return jsonify({'success': True, 'reframedText': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/interview-feedback', methods=['POST'])
def interview_feedback():
    try:
        data = request.json
        question = data.get('question')
        answer = data.get('answer')
        role = data.get('role')
        uid = data.get('uid')
        
        prompt = f"""Evaluate this interview answer for a {role} position.

Question: "{question}"
Answer: "{answer}"

Provide:
1. Scores (0-100) for clarity, structure, and confidence
2. Constructive feedback in 2-3 sentences
3. One specific improvement suggestion

Be encouraging and supportive."""
        
        result = call_groq_api(prompt)
        
        # Update confidence score
        if uid:
            from config.firebase import db
            user_data = db.child('users').child(uid).get().val()
            if user_data:
                new_score = min(100, user_data.get('confidenceScore', 0) + 15)
                db.child('users').child(uid).update({'confidenceScore': new_score}, None)
        
        return jsonify({'success': True, 'feedback': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/career-roadmap', methods=['POST'])
def career_roadmap():
    try:
        data = request.json
        current_role = data.get('currentRole')
        target_role = data.get('targetRole')
        industry = data.get('industry')
        
        prompt = f"""Create a 4-step career roadmap for transitioning from {current_role} to {target_role} in {industry}.

For each step, include:
- Specific skills to develop
- Recommended certifications or courses
- Networking actions
- Timeline estimate

Make it actionable and encouraging for women returning to work."""
        
        result = call_groq_api(prompt)
        return jsonify({'success': True, 'roadmap': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
