const API_BASE = window.location.origin + '/api';

const api = {
  async signup(data) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const text = await res.text();
    try { return JSON.parse(text); } catch(e) { throw new Error('Server error: ' + text.slice(0, 200)); }
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const text = await res.text();
    try { return JSON.parse(text); } catch(e) { throw new Error('Server error: ' + text.slice(0, 200)); }
  },

  async getUser(uid) {
    const res = await fetch(`${API_BASE}/user/${uid}`);
    return res.json();
  },

  async updateUser(uid, data) {
    const res = await fetch(`${API_BASE}/user/${uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getProgress(uid) {
    const res = await fetch(`${API_BASE}/user/${uid}/progress`);
    return res.json();
  },

  async getJobs(filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/jobs?${params}`);
    return res.json();
  },

  async getMentors(industry) {
    const params = industry ? `?industry=${industry}` : '';
    const res = await fetch(`${API_BASE}/mentors${params}`);
    return res.json();
  },

  async getPosts() {
    const res = await fetch(`${API_BASE}/peer/posts`);
    return res.json();
  },

  async createPost(content, userId) {
    const res = await fetch(`${API_BASE}/peer/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, userId })
    });
    return res.json();
  },

  async reportPost(postId, reason) {
    const res = await fetch(`${API_BASE}/peer/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, reason })
    });
    return res.json();
  },

  async generateResumeGap(data) {
    const res = await fetch(`${API_BASE}/ai/resume-gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getInterviewFeedback(data) {
    const res = await fetch(`${API_BASE}/ai/interview-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getCareerRoadmap(data) {
    const res = await fetch(`${API_BASE}/ai/career-roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

window.api = api;
