let currentUser = null;

async function handleSignup() {
  const pass = document.getElementById('signupPass').value;
  const confirm = document.getElementById('confirmPass').value;
  const declare = document.getElementById('selfDeclare').checked;

  if (pass.length < 6) {
    document.getElementById('passMatchError').innerText = 'password must be at least 6 characters';
    return;
  }
  if (pass !== confirm) {
    document.getElementById('passMatchError').innerText = 'passwords need to match';
    return;
  }
  document.getElementById('passMatchError').innerText = '';

  if (!declare) {
    alert('please tick the box — this is a women-first space');
    return;
  }

  const data = {
    email: document.getElementById('signupEmail').value,
    password: pass,
    fullName: document.getElementById('fullName').value,
    industry: document.getElementById('industry').value,
    prevRole: document.getElementById('prevRole').value,
    breakDuration: document.getElementById('breakDuration').value,
    targetRole: document.getElementById('targetRole').value,
    workPref: document.getElementById('workPref').value
  };

  if (!data.email || !data.fullName) {
    alert('Please fill in your name and email');
    return;
  }

  try {
    const result = await api.signup(data);
    if (result.success) {
      currentUser = { uid: result.uid, ...data };
      localStorage.setItem('relaunchher_uid', result.uid);
      localStorage.setItem('relaunchher_user', data.fullName || 'Friend');
      window.showDashboard();
    } else {
      alert('Signup failed: ' + result.error);
    }
  } catch (error) {
    alert('Signup failed: ' + error.message);
  }
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;

  if (!email) { document.getElementById('loginEmailError').innerText = 'email please'; return; }
  if (!pass) { document.getElementById('loginPassError').innerText = 'password needed'; return; }
  document.getElementById('loginEmailError').innerText = '';
  document.getElementById('loginPassError').innerText = '';

  try {
    const result = await api.login(email, pass);
    if (result.success) {
      currentUser = result.user;
      localStorage.setItem('relaunchher_uid', result.uid);
      localStorage.setItem('relaunchher_user', (result.user && result.user.fullName) ? result.user.fullName : email.split('@')[0]);
      window.showDashboard();
    } else {
      alert('Login failed: ' + result.error);
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

async function showDashboardMain() {
  const userName = localStorage.getItem('relaunchher_user') || 'Friend';
  const uid = localStorage.getItem('relaunchher_uid');

  let readiness = 0, confidence = 0;
  if (uid) {
    try {
      const progress = await api.getProgress(uid);
      readiness = progress.readinessScore || 0;
      confidence = progress.confidenceScore || 0;
    } catch (e) {}
  }

  document.getElementById('mainContentArea').innerHTML = `
    <div class="welcome-header">
      <div class="user-greeting"><i class="fas fa-heart" style="color:#f28bb3;"></i> Welcome back, <span>${userName}</span></div>
      <p style="color:#af5286; font-size:1.4rem; margin-top:0.6rem;">you're glowing — let's rise together</p>
    </div>
    <div class="progress-row">
      <div class="progress-card"><div class="circle-progress" style="background: conic-gradient(#f28bb3 0deg ${readiness * 3.6}deg, #ffd6e8 ${readiness * 3.6}deg 360deg);">${readiness}%</div><div><strong style="font-size:1.4rem;">readiness</strong><br> keep going!</div></div>
      <div class="progress-card"><div class="circle-progress" style="background: conic-gradient(#f4a2c6 0deg ${confidence * 3.6}deg, #ffd6e8 ${confidence * 3.6}deg 360deg);">${confidence}%</div><div><strong style="font-size:1.4rem;">confidence</strong><br> you're growing!</div></div>
    </div>
    <h2 style="color:#791e54;">your comeback toolkit</h2>
    <div class="feature-grid">
      <div class="feature-card" onclick="showFeature('resumeGap')"><i class="fas fa-wand-magic"></i><h3>AI Resume Gap</h3><p>reframe with power</p></div>
      <div class="feature-card" onclick="showFeature('roadmap')"><i class="fas fa-map"></i><h3>Career Roadmap</h3><p>skills & certs</p></div>
      <div class="feature-card" onclick="showFeature('interview')"><i class="fas fa-microphone"></i><h3>Interview Practice</h3><p>simulate & shine</p></div>
      <div class="feature-card" onclick="showFeature('jobs')"><i class="fas fa-briefcase"></i><h3>Job Discovery</h3><p>returnship roles</p></div>
      <div class="feature-card" onclick="showFeature('mentorship')"><i class="fas fa-hand-holding-heart"></i><h3>Mentorship</h3><p>leaders who care</p></div>
      <div class="feature-card" onclick="showFeature('peer')"><i class="fas fa-comment-dots"></i><h3>Peer Support</h3><p>you're not alone</p></div>
    </div>
  `;
}

async function showFeature(feature) {
  let content = '';
  const uid = localStorage.getItem('relaunchher_uid');

  if (feature === 'resumeGap') {
    content = `<div class="feature-page"><h2>AI transformation room</h2>
      <div class="form-group"><label>Previous role</label><input id="prevRoleGap" placeholder="Product Manager"></div>
      <div class="form-group"><label>Break duration</label><input id="breakGap" placeholder="2.5 years"></div>
      <div class="form-group"><label>Reason</label><input id="reasonGap" placeholder="family focus"></div>
      <button class="btn-primary" onclick="generateGapReframe()">reframe with AI</button>
      <p id="gapOutput" style="background:#ffeaf5; padding:1.8rem; border-radius:40px; margin-top:1.5rem; min-height:60px;"></p>
      <button class="btn-primary" style="width:auto; display:none;" id="copyGapBtn" onclick="copyGap()"><i class="fas fa-copy"></i> copy</button></div>`;
  } else if (feature === 'roadmap') {
    content = `<div class="feature-page"><h2>guided comeback journey</h2>
      <div class="form-group"><label>Current Role</label><input id="currentRoleRoadmap" placeholder="Marketing Manager"></div>
      <div class="form-group"><label>Target Role</label><input id="targetRoleRoadmap" placeholder="Product Manager"></div>
      <div class="form-group"><label>Industry</label><input id="industryRoadmap" placeholder="Tech"></div>
      <button class="btn-primary" onclick="generateRoadmap()">Generate Roadmap</button>
      <div id="roadmapOutput" style="background:#ffeaf5; padding:1.8rem; border-radius:40px; margin-top:1.5rem; min-height:60px;"></div></div>`;
  } else if (feature === 'interview') {
    content = `<div class="feature-page"><h2>friendly interview practice</h2>
      <div class="form-group"><label>Role</label><select id="interviewRole"><option>Product Manager</option><option>UX Designer</option><option>Marketing Lead</option></select></div>
      <div class="form-group"><label>Question</label><input id="interviewQuestion" value="Tell me about a time you led through ambiguity"></div>
      <div class="form-group"><label>Your Answer</label><textarea id="interviewAnswer" rows="4" placeholder="your answer..."></textarea></div>
      <button class="btn-primary" onclick="getInterviewFeedback()">get AI feedback</button>
      <div id="feedbackOutput" style="background:#ffe4f3; padding:1.4rem; border-radius:40px; margin-top:1rem; min-height:60px;"></div></div>`;
  } else if (feature === 'jobs') {
    content = `<div class="feature-page"><h2>job discovery</h2>
      <div class="job-filters">
        <select id="jobMode" onchange="loadJobs()"><option value="">all modes</option><option value="remote">remote</option><option value="hybrid">hybrid</option><option value="onsite">on-site</option></select>
        <select id="jobType" onchange="loadJobs()"><option value="">all types</option><option value="returnship">returnship</option></select>
      </div>
      <div id="jobsList"></div></div>`;
    setTimeout(loadJobs, 100);
  } else if (feature === 'mentorship') {
    content = `<div class="feature-page"><h2>mentorship</h2>
      <div class="form-group"><label>industry</label><select id="mentorIndustry" onchange="loadMentors()"><option value="">all</option><option value="tech">tech</option><option value="finance">finance</option><option value="creative">creative</option></select></div>
      <div id="mentorsList"></div></div>`;
    setTimeout(loadMentors, 100);
  } else if (feature === 'peer') {
    content = `<div class="feature-page"><h2>peer support</h2>
      <textarea id="newPost" placeholder="share anonymously..." rows="2"></textarea>
      <button class="btn-primary" style="width:auto;" onclick="createPost()">post</button>
      <hr><div id="postsList"></div></div>`;
    setTimeout(loadPosts, 100);
  } else if (feature === 'assessment') {
    try {
      const progress = uid ? await api.getProgress(uid) : {};
      const r = progress.readinessScore || 0;
      const c = progress.confidenceScore || 0;
      content = `<div class="feature-page"><h2>readiness assessment</h2>
        <div class="circle-progress" style="margin:auto; width:140px; height:140px; background: conic-gradient(#f28bb3 0deg ${r * 3.6}deg, #ffd6e8 ${r * 3.6}deg 360deg);">${r}%</div>
        <p style="margin-top:2rem;"><strong>Readiness:</strong> ${r}% &nbsp; <strong>Confidence:</strong> ${c}%</p>
        <p style="background:#ffeaf5; padding:1rem; border-radius:20px; margin-top:1rem;">Complete AI features to boost your scores!</p></div>`;
    } catch (e) {
      content = `<div class="feature-page"><h2>readiness assessment</h2><p>Failed to load scores.</p></div>`;
    }
  }

  document.getElementById('mainContentArea').innerHTML = content;
}

async function generateGapReframe() {
  const data = {
    prevRole: document.getElementById('prevRoleGap').value,
    breakDuration: document.getElementById('breakGap').value,
    reason: document.getElementById('reasonGap').value,
    uid: localStorage.getItem('relaunchher_uid')
  };
  if (!data.prevRole || !data.breakDuration || !data.reason) { alert('Please fill all fields'); return; }

  document.getElementById('gapOutput').innerText = 'Generating...';
  try {
    const result = await api.generateResumeGap(data);
    if (result.success) {
      document.getElementById('gapOutput').innerText = result.reframedText;
      document.getElementById('copyGapBtn').style.display = 'inline-block';
    } else {
      document.getElementById('gapOutput').innerText = 'Error: ' + result.error;
    }
  } catch (e) {
    document.getElementById('gapOutput').innerText = 'Failed to generate. Please try again.';
  }
}

async function generateRoadmap() {
  const data = {
    currentRole: document.getElementById('currentRoleRoadmap').value,
    targetRole: document.getElementById('targetRoleRoadmap').value,
    industry: document.getElementById('industryRoadmap').value
  };
  document.getElementById('roadmapOutput').innerText = 'Generating roadmap...';
  try {
    const result = await api.getCareerRoadmap(data);
    if (result.success) {
      document.getElementById('roadmapOutput').innerHTML = result.roadmap.replace(/\n/g, '<br>');
    } else {
      document.getElementById('roadmapOutput').innerText = 'Error: ' + result.error;
    }
  } catch (e) {
    document.getElementById('roadmapOutput').innerText = 'Failed to generate roadmap.';
  }
}

async function getInterviewFeedback() {
  const data = {
    role: document.getElementById('interviewRole').value,
    question: document.getElementById('interviewQuestion').value,
    answer: document.getElementById('interviewAnswer').value,
    uid: localStorage.getItem('relaunchher_uid')
  };
  if (!data.answer) { alert('Please provide your answer'); return; }

  document.getElementById('feedbackOutput').innerText = 'Analyzing...';
  try {
    const result = await api.getInterviewFeedback(data);
    if (result.success) {
      document.getElementById('feedbackOutput').innerHTML = result.feedback.replace(/\n/g, '<br>');
    } else {
      document.getElementById('feedbackOutput').innerText = 'Error: ' + result.error;
    }
  } catch (e) {
    document.getElementById('feedbackOutput').innerText = 'Failed to get feedback.';
  }
}

async function loadJobs() {
  const mode = document.getElementById('jobMode')?.value;
  const type = document.getElementById('jobType')?.value;
  try {
    const result = await api.getJobs({ mode, type });
    const jobsList = document.getElementById('jobsList');
    if (result.success && result.jobs.length > 0) {
      jobsList.innerHTML = result.jobs.map(job => `
        <div class="job-card"><h3>${job.title}</h3>
        <p>${job.company} · ${job.mode} · ${(job.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</p></div>
      `).join('');
    } else {
      jobsList.innerHTML = '<p>No jobs found. Check back soon!</p>';
    }
  } catch (e) {
    document.getElementById('jobsList').innerHTML = '<p>Failed to load jobs.</p>';
  }
}

async function loadMentors() {
  const industry = document.getElementById('mentorIndustry')?.value;
  try {
    const result = await api.getMentors(industry);
    const mentorsList = document.getElementById('mentorsList');
    if (result.success && result.mentors.length > 0) {
      mentorsList.innerHTML = result.mentors.map(m => `
        <div style="background:#ffe2fd; padding:1.2rem; border-radius:50px; margin-top:1rem;">
          ${m.name} · ${m.title} · ${m.sessions || 0} sessions available
        </div>
      `).join('');
    } else {
      mentorsList.innerHTML = '<p>No mentors found.</p>';
    }
  } catch (e) {
    document.getElementById('mentorsList').innerHTML = '<p>Failed to load mentors.</p>';
  }
}

async function loadPosts() {
  try {
    const result = await api.getPosts();
    const postsList = document.getElementById('postsList');
    if (result.success && result.posts.length > 0) {
      postsList.innerHTML = result.posts.map(post => `
        <div class="post-card">anonymous: ${post.content}
          <button class="report-btn" onclick="reportPost('${post.id}')">report</button>
        </div>
      `).join('');
    } else {
      postsList.innerHTML = '<p>No posts yet. Be the first to share!</p>';
    }
  } catch (e) {
    document.getElementById('postsList').innerHTML = '<p>Failed to load posts.</p>';
  }
}

async function createPost() {
  const content = document.getElementById('newPost').value;
  if (!content) return;
  const uid = localStorage.getItem('relaunchher_uid');
  try {
    const result = await api.createPost(content, uid);
    if (result.success) {
      document.getElementById('newPost').value = '';
      loadPosts();
    }
  } catch (e) {
    alert('Failed to create post');
  }
}

async function reportPost(postId) {
  const reason = prompt('Why are you reporting this post?');
  if (!reason) return;
  try {
    await api.reportPost(postId, reason);
    alert('Report submitted. Thank you!');
  } catch (e) {
    alert('Failed to submit report');
  }
}

function copyGap() {
  const text = document.getElementById('gapOutput').innerText;
  navigator.clipboard?.writeText(text);
  alert('Copied to clipboard!');
}

window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.showDashboardMain = showDashboardMain;
window.showFeature = showFeature;
window.generateGapReframe = generateGapReframe;
window.generateRoadmap = generateRoadmap;
window.getInterviewFeedback = getInterviewFeedback;
window.loadJobs = loadJobs;
window.loadMentors = loadMentors;
window.loadPosts = loadPosts;
window.createPost = createPost;
window.reportPost = reportPost;
window.copyGap = copyGap;
