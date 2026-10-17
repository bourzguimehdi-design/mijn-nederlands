/*
 * Mijn Nederlands: structured curriculum and short guided checks.
 * Storage is additive; it does not change profile or practice history.
 */
const CurriculumEngine = {
  KEY: 'mijn_nederlands_curriculum_v1',
  currentId: null,
  escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
  },
  normalize(value) {
    return String(value ?? '').normalize('NFC').trim().toLocaleLowerCase('nl-NL')
      .replace(/\s+([,.!?;:])/g, '$1')
      .replace(/[.!?]+$/g, '')
      .replace(/\s+/g, ' ').trim();
  },
  load() {
    try {
      const value = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (_) { return {}; }
  },
  save(data) { localStorage.setItem(this.KEY, JSON.stringify(data)); },
  find(id) { return DutchCurriculum.find(item => item.id === id); },
  nextLesson(level = 'A2') {
    const lessons = DutchCurriculum.filter(item => item.level === level);
    const progress = this.load();
    return lessons.find(item => !progress[item.id]?.passed) || null;
  },
  openNext(level = 'A2') {
    this.open(level);
    const next = this.nextLesson(level);
    if (next) this.openLesson(next.id);
  },
  isCorrectAnswer(question, input) {
    const given = this.normalize(input);
    const expected = this.normalize(question.answer);
    if (given === expected) return true;
    if (!given || !question.prompt.includes('___')) return false;
    const template = question.prompt.replace(/^Complete:\s*/i, '')
      .replace(/\s*\([^)]*\)\s*$/g, '').trim();
    return given === this.normalize(template.replace('___', question.answer));
  },
  getLearningStatus(level = 'A2') {
    const stats = this.stats(level);
    const next = this.nextLesson(level);
    return { ...stats, nextId: next?.id || null, nextTitle: next?.title || null };
  },
  stats(level) {
    const items = DutchCurriculum.filter(item => item.level === level);
    const progress = this.load();
    return {
      total: items.length,
      checked: items.filter(item => progress[item.id]?.lastScore !== undefined).length,
      passed: items.filter(item => progress[item.id]?.passed === true).length
    };
  },
  open(level = 'A2') {
    if (typeof hideAllSections === 'function') hideAllSections();
    const root = document.getElementById('curriculum');
    if (!root) return;
    root.classList.remove('hidden');
    this.currentId = null;
    this.renderCatalog(level);
    window.scrollTo(0, 0);
  },
  renderCatalog(level = 'A2') {
    const root = document.getElementById('curriculum');
    if (!root) return;
    const progress = this.load();
    const stat = this.stats(level);
    const tabs = ['A1', 'A2', 'B1'].map(item =>
      `<button type="button" class="curriculum-tab ${item === level ? 'selected' : ''}" data-level="${item}">${item}</button>`
    ).join('');
    const cards = DutchCurriculum.filter(item => item.level === level).map((item, i) => {
      const record = progress[item.id];
      const status = record?.passed ? '✓ Quick check passed' : record?.lastScore !== undefined ? '↻ Practice again' : 'Not checked yet';
      return `<button type="button" class="curriculum-topic" data-topic="${this.escape(item.id)}">
        <span class="curriculum-topic-number">${i + 1}</span>
        <span class="curriculum-topic-text"><strong>${this.escape(item.title)}</strong><small>${this.escape(item.goal)}</small></span>
        <span class="curriculum-topic-status">${status}</span>
      </button>`;
    }).join('');
    root.innerHTML = `<div class="curriculum-header">
      <button type="button" class="curriculum-back" data-back="dashboard">← Dashboard</button>
      <div class="skill-label">STRUCTURED DUTCH LEARNING</div>
      <h1>Learning path</h1>
      <p class="subtitle">Learn a topic, check your understanding, then practice it. Checks track lesson progress, not certified CEFR proficiency.</p>
      <div class="curriculum-tabs">${tabs}</div>
      <p class="curriculum-count"><strong>${stat.passed} / ${stat.total}</strong> quick checks passed · ${stat.checked} attempted</p>
      ${this.nextLesson(level) ? `<button type="button" class="primary" id="curriculumNext">Continue learning: ${this.escape(this.nextLesson(level).title)} →</button>` : `<p>All ${level} quick checks passed. Keep practicing to maintain your skills.</p>`}
    </div><div class="curriculum-list">${cards}</div>`;
    const nextButton = root.querySelector('#curriculumNext');
    if (nextButton) nextButton.onclick = () => this.openNext(level);
    root.querySelector('[data-back="dashboard"]').onclick = () => Dashboard.open();
    root.querySelectorAll('[data-level]').forEach(btn => btn.onclick = () => this.renderCatalog(btn.dataset.level));
    root.querySelectorAll('[data-topic]').forEach(btn => btn.onclick = () => this.openLesson(btn.dataset.topic));
  },
  openLesson(id) {
    const item = this.find(id);
    const root = document.getElementById('curriculum');
    if (!item || !root) return;
    this.currentId = id;
    const progress = this.load()[id];
    const examples = item.examples.map(pair => `<div class="curriculum-example"><strong lang="nl">${this.escape(pair.nl)}</strong><span>${this.escape(pair.en)}</span></div>`).join('');
    const extra = (typeof DutchLessonGuides !== 'undefined' && DutchLessonGuides[item.id]) || {};
    const guide = extra.rules?.length ? `<div class="card curriculum-panel"><h2>Step by step</h2><ol class="curriculum-rules">${extra.rules.map(rule => `<li>${this.escape(rule)}</li>`).join('')}</ol></div>` : '';
    const pitfalls = extra.mistakes?.length ? `<div class="card curriculum-panel"><h2>Common mistakes</h2>${extra.mistakes.map(m => `<p class="curriculum-mistake"><strong>✗ ${this.escape(m.wrong)}</strong><br><span>✓ ${this.escape(m.right)}</span><br>${this.escape(m.why)}</p>`).join('')}</div>` : '';
    const practicePrompt = `<div class="card curriculum-panel"><h2>Use it yourself</h2><p>Before the check, say or write two new Dutch sentences using this topic. Compare them with the examples above. For personalized corrections, choose AI practice below.</p>${extra.task ? `<p><strong>Challenge:</strong> ${this.escape(extra.task)}</p>` : ''}</div>`;
    const depth = item.level === 'A2' && typeof A2Depth !== 'undefined' ? A2Depth[item.id] : null;
    const deeper = depth ? `<div class="card curriculum-panel"><h2>Guided learning steps</h2><ol class="curriculum-rules">${depth.steps.map(step => `<li>${this.escape(step)}</li>`).join('')}</ol><h3>Translate into Dutch</h3><p>Try these without looking at the examples, then reveal the model answers.</p>${depth.translationDrills.map(drill => `<details class="curriculum-mistake"><summary>${this.escape(drill.prompt)}</summary><p lang="nl">${this.escape(drill.answer)}</p></details>`).join('')}<p><strong>Independent challenge:</strong> ${this.escape(depth.challenge)}</p></div>` : '';
    const checks = item.checks.map((q, index) => `<label class="curriculum-question"><strong>${index + 1}. ${this.escape(q.prompt)}</strong><input type="text" autocomplete="off" data-answer="${index}" placeholder="Your answer" aria-label="Answer ${index + 1}" /></label>`).join('');
    root.innerHTML = `<div class="curriculum-lesson">
      <button type="button" class="curriculum-back" id="curriculumToCatalog">← ${item.level} topics</button>
      <div class="skill-label">${item.level} · GUIDED LESSON</div>
      <h1>${this.escape(item.title)}</h1><p class="subtitle">${this.escape(item.goal)}</p>
      <div class="card curriculum-panel"><h2>Understand</h2><p>${this.escape(item.explanation)}</p></div>
      <div class="card curriculum-panel"><h2>Examples</h2>${examples}</div>
      ${guide}${pitfalls}${deeper}${practicePrompt}
      <div class="card curriculum-panel"><h2>Quick understanding check</h2>
      <p class="small">Enter the missing word for blanks (___), or a complete sentence. Aim for both correct. Capitalization and final punctuation are ignored.</p>
      ${checks}<button type="button" class="primary" id="curriculumCheck">Check answers</button>
      <div id="curriculumFeedback" aria-live="polite"></div></div>
      ${progress ? `<p class="small">Previous check: ${progress.lastScore}/${item.checks.length} correct${progress.passed ? ' · passed' : ''}</p>` : ''}
      <button type="button" class="primary" id="curriculumPractice">Guided AI practice →</button>
      <button type="button" class="primary" id="curriculumMastery">Finish lesson: AI assessment →</button>
      <p class="small">The Daily Plan lesson completes after you finish the AI assessment, even if you do not pass. Your quick-check result is kept separately from mastery.</p>
      <p class="small">AI practice requires your existing Worker connection. A quick check is not mastery. Use generated AI practice to apply the topic; a verified mastery assessment is a separate future step.</p>
    </div>`;
    root.querySelector('#curriculumToCatalog').onclick = () => this.renderCatalog(item.level);
    root.querySelector('#curriculumCheck').onclick = () => this.check(id);
    root.querySelector('#curriculumPractice').onclick = () => this.startPractice(id);
    root.querySelector('#curriculumMastery').onclick = () => A2Mastery.start(id);
  },
  check(id) {
    const item = this.find(id);
    const root = document.getElementById('curriculum');
    if (!item || !root) return;
    let score = 0;
    const details = item.checks.map((q, i) => {
      const answer = root.querySelector(`[data-answer="${i}"]`)?.value || '';
      const good = this.isCorrectAnswer(q, answer);
      if (good) score++;
      return `<p class="curriculum-feedback-line">${good ? '✓' : '✗'} ${this.escape(q.prompt)}<br><span>Expected: ${this.escape(q.answer || '(no ending)')}</span></p>`;
    });
    const progress = this.load();
    const previous = progress[id] || {};
    progress[id] = {
      ...previous,
      lastScore: score,
      passed: previous.passed === true || score === item.checks.length,
      attempts: (Number(previous.attempts) || 0) + 1,
      lastCheckedAt: new Date().toISOString()
    };
    try { this.save(progress); }
    catch (error) { console.error('Could not save curriculum check:', error); }
    root.querySelector('#curriculumFeedback').innerHTML = `<div class="curriculum-feedback"><strong>${score}/${item.checks.length} correct</strong>${details.join('')}${score === item.checks.length ? '<p>✓ Quick check passed. This records understanding, not topic mastery. Complete fresh AI practice to demonstrate application.</p>' : '<p>Review the examples and try again. Previous passes are retained.</p>'}</div>`;
  },
  startPractice(id) {
    const item = this.find(id);
    if (!item || typeof PracticeUI === 'undefined') return;
    // A curriculum-initiated session is not a daily-plan activity.
    if (typeof Dashboard !== 'undefined') Dashboard.activeActivity = null;
    const profile = ProfileEngine.refresh();
    // All curriculum topics can be practised, including topics not yet
    // promoted into the adaptive learner profile. Curriculum study does
    // not change active-topic eligibility in the daily planner.
    Promise.resolve(PracticeUI.startFromActivity({
      id: `curriculum-${id}`, type: 'concept', concept: id,
      minutes: 10, level: item.level, source: 'curriculum_practice', title: item.title
    })).catch(error => {
      console.error('Could not start curriculum practice:', error);
      this.openLesson(id);
      const feedback = document.getElementById('curriculumFeedback');
      if (feedback) feedback.textContent = 'Practice could not start. Check your connection and try again.';
    });
  }
};
