/* =================================================================
   OXYGY SCORM MODULE — Level 1: Prompt Engineering Essentials
   V2.0 — Main controller: slides, navigation, state, SCORM
   Depends on: scorm-api.js, drag-drop.js, card-flip.js,
               spectrum-slider.js, quiz-engine.js
   ================================================================= */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // SECTION 1: ICON HELPER — Inline Lucide SVGs
  // ═══════════════════════════════════════════════════════════════

  var ICONS = {
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'x': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    'chevron-left': '<polyline points="15 18 9 12 15 6"/>',
    'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
    'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    'user-circle': '<path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/>',
    'info': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    'check-square': '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    'align-left': '<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>',
    'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    'git-branch': '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    'copy': '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    'refresh-cw': '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    'users': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'slash': '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>',
    'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    'rotate-ccw': '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>'
  };

  function icon(name, size, color) {
    size = size || 24;
    color = color || 'currentColor';
    var paths = ICONS[name] || '';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="' + color +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      paths + '</svg>';
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 2: COURSE STATE
  // ═══════════════════════════════════════════════════════════════

  var TOTAL_SLIDES = 15;

  var state = {
    currentSlide: 0,
    activeTab: 'braindump',
    slide06Completed: false,
    slide03Position: 100,
    challengeSelected: null,
    challengeConfirmed: false,
    confidenceOpen: null,
    confidenceClose: null,
    quizState: null,
    slide07AllFlipped: false,
    slide10AllFlipped: false
  };

  var SECTIONS = [
    'FOUNDATIONS',           // 0: slide 1
    'FOUNDATIONS',           // 1: slide 2
    'FOUNDATIONS',           // 2: slide 3
    'FOUNDATIONS',           // 3: slide 4
    'STRUCTURED PROMPTING',  // 4: slide 5
    'STRUCTURED PROMPTING',  // 5: slide 6
    'STRUCTURED PROMPTING',  // 6: slide 7
    'STRUCTURED PROMPTING',  // 7: slide 8
    'ADVANCED TECHNIQUES',   // 8: slide 9
    'ADVANCED TECHNIQUES',   // 9: slide 10
    'PRACTICE',             // 10: slide 11
    'PRACTICE',             // 11: slide 12
    'PRACTICE',             // 12: slide 13
    'YOUR TOOLKIT',         // 13: slide 14
    'YOUR TOOLKIT'          // 14: slide 15
  ];

  function serializeState() {
    return JSON.stringify({
      slide: state.currentSlide,
      activeTab: state.activeTab,
      slide06Completed: state.slide06Completed,
      slide03Position: state.slide03Position,
      challengeSelected: state.challengeSelected,
      challengeConfirmed: state.challengeConfirmed,
      confidenceOpen: state.confidenceOpen,
      confidenceClose: state.confidenceClose,
      quiz: window.QuizEngine ? window.QuizEngine.getState() : state.quizState
    });
  }

  function restoreState(json) {
    try {
      var data = JSON.parse(json);
      state.currentSlide = data.slide || 0;
      state.activeTab = data.activeTab || 'braindump';
      state.slide06Completed = data.slide06Completed || false;
      state.slide03Position = data.slide03Position !== undefined ? data.slide03Position : 100;
      state.challengeSelected = data.challengeSelected;
      state.challengeConfirmed = data.challengeConfirmed || false;
      state.confidenceOpen = data.confidenceOpen || null;
      state.confidenceClose = data.confidenceClose || null;
      state.quizState = data.quiz || null;
      if (state.quizState && window.QuizEngine) {
        window.QuizEngine.restoreState(state.quizState);
      }
    } catch (e) {
      console.warn('[Course] Could not restore state:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 3: TEMPLATE DATA (Slide 14)
  // ═══════════════════════════════════════════════════════════════

  var TEMPLATES = [
    {
      tag: 'RCTF', tagClass: 'color-pill--teal',
      useCase: 'Before any client meeting',
      text: 'You are a [your role] preparing for a [meeting type] with [client/organisation].\nContext: [describe the client situation, background, key relationships in 2-3 sentences].\nTask: Generate [specific output \u2014 e.g., 5 discovery questions / a meeting agenda / key risks to listen for].\nFormat: [bullet list / numbered / table], [tone: professional/conversational], [length: under X words], no preamble.'
    },
    {
      tag: 'BRAIN DUMP', tagClass: 'color-pill--mint',
      useCase: 'When you\'re thinking out loud',
      text: '[Write everything you know about the problem, project, or situation \u2014 no structure needed.\nInclude: what the challenge is, who\'s involved, what you\'ve tried, what you\'re unsure about,\nany constraints or context that might be relevant.]\n\nWhat have I missed? What patterns do you see? What would you suggest?'
    },
    {
      tag: 'CHAIN OF THOUGHT', tagClass: 'color-pill--indigo',
      useCase: 'For strategic decisions and analysis',
      text: '[Describe the decision or analysis you need help with.]\n\nBefore giving your answer, think step by step through:\n1. [Key consideration 1 \u2014 e.g., the stakeholder dynamics]\n2. [Key consideration 2 \u2014 e.g., the risks and assumptions]\n3. [Key consideration 3 \u2014 e.g., alternative approaches]\n\nThen give me your recommendation and explain your reasoning.'
    },
    {
      tag: 'FEW-SHOT', tagClass: 'color-pill--orange',
      useCase: 'For tone-matched writing',
      text: 'Here are [2-3] examples of how we write [email type / document type] at [company/team]:\n\nExample 1: [paste example]\nExample 2: [paste example]\n\nUsing the same tone, style, and structure, write a [document type] for [new situation/context].'
    },
    {
      tag: 'ITERATIVE', tagClass: 'color-pill--green',
      useCase: 'For polishing drafts',
      text: '[Paste your draft or the AI\'s previous output]\n\nReview this and make the following specific changes:\n- [Change 1 \u2014 e.g., make the executive summary 30% shorter]\n- [Change 2 \u2014 e.g., replace all jargon with plain language]\n- [Change 3 \u2014 e.g., add a specific call to action at the end]\n\nKeep everything else the same. Do not add new content unless I\'ve asked for it.'
    }
  ];

  // Challenge data (slide 13)
  var CHALLENGE = {
    scenario: 'A colleague has written this prompt to prepare for a client discovery call: "Help me prepare for my meeting."',
    question: 'Which improvement would most dramatically improve the output quality?',
    options: [
      {
        label: 'Option A',
        text: '"Help me prepare for my discovery call with Novartis. They\'re evaluating our proposal for an organisational design project. The call is tomorrow, 45 minutes with their CHRO."',
        quality: 'partial',
        response: 'Here are some points to consider for your client meeting: 1. Review the client\'s current situation and pain points 2. Prepare an agenda for the 2-hour session 3. Consider stakeholder engagement approaches 4. Have clear next steps ready. Would you like me to expand on any of these areas?',
        responseLabel: 'AI RESPONSE TO OPTION A \u2014 What this prompt actually produces',
        badge: 'Partially improved',
        badgeClass: 'badge-orange',
        reflection: 'Better than the original, but still generic. The AI doesn\'t know who the client is, what the real challenge is, or what format you need. It\'s responding with a framework, not a plan.'
      },
      {
        label: 'Option B',
        text: '"You are a senior management consultant preparing for a client discovery call. The client is Novartis, evaluating a proposal for an organisational design project. The meeting is tomorrow (45 mins) with their CHRO. Generate: 1) 5 discovery questions to uncover their real pain points, 2) Key risks to listen for, 3) How to close for next steps. Professional tone, bullet format."',
        quality: 'best',
        response: '<strong>Workshop Structure \u2014 Leadership Alignment on LMS Adoption</strong>\n\n<strong>Objective:</strong> Surface and address root causes of resistance from a position of honest dialogue rather than change management orthodoxy.\n\n<strong>Agenda (2 hours):</strong>\n1. Open honestly (15 min): Acknowledge the three previous tech failures. Name the fear in the room. This earns trust.\n2. Diagnostic exercise (30 min): Small group activity \u2014 what specifically failed before and why? Separate technology failure from change management failure.\n3. This time is different (25 min): Present the differences in implementation approach. Invite challenge.\n4. Commitment building (30 min): What would each leader need to see in the first 30 days to believe this is working?\n5. Close with actions (20 min): Named owners, specific commitments, review date.',
        responseLabel: 'AI RESPONSE TO OPTION B \u2014 What this prompt actually produces',
        badge: 'Strong output',
        badgeClass: 'badge-green',
        reflection: 'This is immediately usable. The AI understood the client context, the history of failure, and the workshop objective \u2014 and produced a structured, specific output with named activities and timings.'
      },
      {
        label: 'Option C',
        text: '"Think step by step about what I need to know before a discovery call, then help me prepare."',
        quality: 'partial',
        response: 'Let me think through this step by step. Step 1 \u2014 What makes leadership alignment workshops succeed: Psychological safety, shared diagnosis of the problem, clear decision rights... Step 2 \u2014 Common failure modes: Rushing to solutions, underestimating resistance, not naming the real issue... Step 3 \u2014 Recommendation: I would structure this around diagnosis before prescription. However, I\'d need to know more about your client context to be specific \u2014 what industry, what\'s the history, who are the key stakeholders?',
        responseLabel: 'AI RESPONSE TO OPTION C \u2014 What this prompt actually produces',
        badge: 'Reasonable but incomplete',
        badgeClass: 'badge-orange',
        reflection: 'The reasoning is strong \u2014 but the AI correctly flagged that it doesn\'t have enough context. Chain of Thought without context produces thoughtful generalities. Combining it with context would produce something far more specific and actionable.'
      }
    ]
  };

  // ═══════════════════════════════════════════════════════════════
  // SECTION 4: SLIDE RENDERERS
  // ═══════════════════════════════════════════════════════════════

  var slides = [];

  // ─── SLIDE 01: Welcome / Title ───
  slides[0] = function() {
    return '<div style="text-align:center;">' +
      '<div class="slide-eyebrow stagger-1">OXYGY AI UPSKILLING \u2014 LEVEL 1</div>' +
      '<h1 class="slide-heading-hero stagger-2">Prompt Engineering <span class="accent">Essentials</span></h1>' +
      '<p style="font-size:16px;color:var(--color-text-light);margin-bottom:var(--space-md);" class="stagger-3">From casual users to confident communicators</p>' +
      '<div class="divider stagger-3"></div>' +
      '<div class="pills-row stagger-4">' +
        '<span class="pill">' + icon('clock', 16, '#38B2AC') + ' 15\u201320 minutes</span>' +
        '<span class="pill">' + icon('layers', 16, '#38B2AC') + ' 15 slides</span>' +
        '<span class="pill">' + icon('check-circle', 16, '#38B2AC') + ' Quiz included</span>' +
      '</div>' +
      '<p style="max-width:560px;margin:0 auto var(--space-xl);font-size:15px;color:var(--color-text-body);line-height:1.7;" class="stagger-5">You\'re probably already using AI. This module will help you get dramatically better results \u2014 by understanding how to communicate with it. There\'s no single formula. By the end, you\'ll have a toolkit of approaches you can apply to your real work.</p>' +
      '<div class="stagger-5" style="margin-top:40px;">' +
        '<button class="btn btn-primary" onclick="CourseNav.next()">Start Learning ' + icon('arrow-right', 16, '#fff') + '</button>' +
      '</div>' +
    '</div>';
  };

  // ─── SLIDE 02: The Prompting Mindset ───
  slides[1] = function() {
    return '' +
      '<div class="slide-eyebrow stagger-1">FOUNDATIONS</div>' +
      '<h2 class="slide-heading stagger-2">AI is not a <span class="accent">search engine</span></h2>' +
      '<div class="slide-two-col">' +
        '<div class="stagger-3">' +
          '<p class="slide-intro">When you type into Google, you\'re looking for a document that already exists. When you type into ChatGPT or Claude, you\'re creating something new \u2014 in real time, based entirely on what you give it.</p>' +
          '<p style="font-size:15px;color:var(--color-text-body);line-height:1.7;margin-bottom:var(--space-lg);">The output quality is a direct reflection of the input quality.</p>' +
          '<div class="pull-quote">\u201CThink of AI as a brilliant new colleague who knows almost everything \u2014 but only knows what you tell them about you, your work, and what you need.\u201D</div>' +
          '<p style="font-size:15px;color:var(--color-text-body);line-height:1.7;margin-top:var(--space-lg);">This shift in mental model is the foundation of good prompting. Everything else builds from here.</p>' +
        '</div>' +
        '<div class="stagger-4">' +
          '<div class="visual-panel">' +
            '<div style="display:flex;align-items:center;gap:16px;justify-content:center;flex-wrap:wrap;">' +
              '<div style="background:var(--color-navy);color:var(--color-white);padding:16px 20px;border-radius:8px;font-size:14px;font-weight:600;text-align:center;min-width:110px;min-height:48px;display:flex;align-items:center;justify-content:center;">Your Input</div>' +
              '<div style="text-align:center;">' +
                '<div style="color:var(--color-teal);">' + icon('arrow-right', 24, '#38B2AC') + '</div>' +
                '<div style="font-size:11px;color:var(--color-text-muted);margin-top:4px;">AI Processing</div>' +
              '</div>' +
              '<div style="background:var(--color-teal);color:var(--color-white);padding:16px 20px;border-radius:8px;font-size:14px;font-weight:600;text-align:center;min-width:110px;min-height:48px;display:flex;align-items:center;justify-content:center;">Your Output</div>' +
            '</div>' +
            '<div style="margin-top:24px;text-align:center;">' +
              '<div style="color:var(--color-success);font-size:14px;font-weight:600;margin-bottom:6px;">Better input \u2192 Better output</div>' +
              '<div style="color:var(--color-error);font-size:14px;font-weight:600;">Vague input \u2192 Vague output</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  };

  // ─── SLIDE 03: Interactive Spectrum Slider ───
  slides[2] = function() {
    return '' +
      '<div class="slide-eyebrow stagger-1">FOUNDATIONS</div>' +
      '<h2 class="slide-heading stagger-2">No formula. Just a <span class="accent">toolkit</span>.</h2>' +
      '<p class="slide-intro stagger-3">Most prompting guides present a single framework as the answer. The reality is more nuanced \u2014 and more useful. Drag the slider to explore the spectrum.</p>' +
      '<div class="spectrum-container stagger-4">' +
        '<div class="spectrum-ends">' +
          '<span class="spectrum-end-label">FREE-FORM</span>' +
          '<span class="spectrum-end-label">STRUCTURED</span>' +
        '</div>' +
        '<div class="spectrum-track-wrap">' +
          '<div class="spectrum-track" id="spectrum-track">' +
            '<div class="spectrum-handle" id="spectrum-handle"></div>' +
          '</div>' +
          '<div class="spectrum-labels">' +
            '<div class="spectrum-label"><span class="spectrum-label-name">Brain Dump</span><span class="spectrum-label-desc">Unstructured thinking</span></div>' +
            '<div class="spectrum-label"><span class="spectrum-label-name">Conversational</span><span class="spectrum-label-desc">Iterative dialogue</span></div>' +
            '<div class="spectrum-label"><span class="spectrum-label-name">RCTF / Template</span><span class="spectrum-label-desc">Repeatable structure</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="technique-panel stagger-4" id="technique-panel">' +
        '<div class="technique-panel-name">Structured / RCTF</div>' +
        '<div class="technique-panel-when">Best when you need a consistent, repeatable output \u2014 especially for tasks your team will run multiple times or share as a template.</div>' +
        '<div class="technique-panel-example prompt-box neutral" style="margin-top:var(--space-md);font-size:13px;">\u201CYou are a senior change management consultant [Role]. We are 6 weeks into an ERP rollout with resistant commercial teams [Context]. Create a 10-question stakeholder survey [Task]. Output as a numbered list, professional tone [Format].\u201D</div>' +
      '</div>' +
      '<div class="insight-box stagger-5">Drag the slider to explore. The best prompters don\'t live at one end \u2014 they move fluidly between approaches depending on the task.</div>';
  };

  // ─── SLIDE 04: The Brain Dump Approach ───
  slides[3] = function() {
    return '' +
      '<div class="slide-eyebrow stagger-1">FOUNDATIONS</div>' +
      '<h2 class="slide-heading stagger-2">When in doubt \u2014 <span class="accent">say everything</span></h2>' +
      '<div class="slide-two-col">' +
        '<div class="stagger-3">' +
          '<p class="slide-intro">The most underrated prompting technique has no structure at all. When you have a lot of context in your head but haven\'t yet organised your thinking, just open the microphone and say everything you know about the problem.</p>' +
          '<div style="margin-bottom:16px;font-size:14px;font-weight:600;color:var(--color-navy);">When to use this approach:</div>' +
          '<div class="card-grid card-grid-2" style="margin-bottom:var(--space-lg);">' +
            '<div class="card" style="min-height:80px;">You\'re early in a project and thinking out loud</div>' +
            '<div class="card" style="min-height:80px;">You have too much context to fit into a structured prompt</div>' +
          '</div>' +
          '<div class="card" style="min-height:80px;margin-bottom:var(--space-lg);">You want the AI to find patterns in your thinking rather than follow your instructions</div>' +
          '<div class="insight-box" style="margin-top:0;">End your brain dump with: <em>\u201CWhat have I missed, and what would you suggest?\u201D</em> \u2014 this turns a monologue into a dialogue.</div>' +
        '</div>' +
        '<div class="stagger-4">' +
          '<div class="visual-panel">' +
            '<div style="font-size:11px;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">BRAIN DUMP PROMPT \u2014 REAL EXAMPLE</div>' +
            '<div class="prompt-box good">\u201COkay so I\'m preparing for a client meeting with a pharma company next Tuesday, they\'re struggling with change management around a new ERP system rollout, the team is resistant especially in the commercial function, there was a previous failed implementation about 3 years ago which is making people nervous, the sponsor is the CFO but she\'s not super visible, I need to run a 2-hour workshop to help align the leadership team on a path forward... what should I be thinking about and what structure would you suggest for the workshop?\u201D</div>' +
            '<div style="text-align:center;margin:12px 0;color:var(--color-teal);">' + icon('arrow-right', 20, '#38B2AC') + '</div>' +
            '<div style="font-size:12px;font-weight:600;color:var(--color-teal);margin-bottom:8px;">The AI now has everything it needs</div>' +
            '<div style="background:var(--color-bg-light);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:14px 18px;font-size:13px;color:var(--color-text-light);line-height:1.6;position:relative;overflow:hidden;">' +
              '<em>\u201CHere\'s what I\'d suggest considering for your workshop structure: First, acknowledge the elephant in the room \u2014 the previous implementation failure...\u201D</em>' +
              '<div style="position:absolute;bottom:0;left:0;right:0;height:40px;background:linear-gradient(transparent,var(--color-bg-light));"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  };

  // ─── SLIDE 05: When Structure Helps ───
  slides[4] = function() {
    return '' +
      '<div class="slide-eyebrow stagger-1">STRUCTURED PROMPTING</div>' +
      '<h2 class="slide-heading stagger-2">From one-off messages to <span class="accent">reusable tools</span></h2>' +
      '<p class="slide-intro stagger-3">Structured prompting earns its value when you need something that works reliably, repeatedly \u2014 across different people, different projects, different days.</p>' +
      '<div class="card-grid card-grid-3 stagger-4">' +
        '<div class="card" style="text-align:center;min-height:140px;">' +
          '<div class="icon-container" style="margin:0 auto var(--space-md);">' + icon('refresh-cw', 24, '#38B2AC') + '</div>' +
          '<div class="card-title">Consistent Outputs</div>' +
          '<div class="card-body">The same structured prompt gives reliably similar results every time \u2014 across different people using it.</div>' +
        '</div>' +
        '<div class="card" style="text-align:center;min-height:140px;">' +
          '<div class="icon-container" style="margin:0 auto var(--space-md);">' + icon('users', 24, '#38B2AC') + '</div>' +
          '<div class="card-title">Shareable Across Teams</div>' +
          '<div class="card-body">Structured prompts can be saved, shared, and standardised \u2014 turning individual capability into team capability.</div>' +
        '</div>' +
        '<div class="card" style="text-align:center;min-height:140px;">' +
          '<div class="icon-container" style="margin:0 auto var(--space-md);">' + icon('zap', 24, '#38B2AC') + '</div>' +
          '<div class="card-title">Faster Execution</div>' +
          '<div class="card-body">Once built, a template prompt takes seconds to fill in \u2014 not minutes to compose from scratch.</div>' +
        '</div>' +
      '</div>' +
      '<p style="font-size:13px;color:var(--color-text-light);margin-top:var(--space-lg);" class="stagger-5">In the next four slides, we\'ll unpack the RCTF framework \u2014 one of the most practical structured prompting approaches \u2014 element by element.</p>';
  };

  // ─── SLIDE 06: RCTF Drag and Drop ───
  slides[5] = function() {
    return '' +
      '<div class="slide-eyebrow stagger-1">STRUCTURED PROMPTING</div>' +
      '<h2 class="slide-heading stagger-2">The RCTF <span class="accent">Framework</span></h2>' +
      '<p class="slide-intro stagger-3">RCTF stands for Role, Context, Task, and Format. Drag each phrase into the correct element below to deconstruct a real prompt.</p>' +
      '<div class="instruction-bar stagger-3">Drag each phrase into the correct RCTF element below</div>' +
      '<div id="slide06-dd" class="stagger-4">' +
        '<div class="chips-source">' +
          '<div class="drag-chip" data-chip-id="s06-role">You are a senior change management consultant with pharma experience</div>' +
          '<div class="drag-chip" data-chip-id="s06-context">We are 6 weeks into an ERP rollout at a global pharma company. Teams are resistant due to a failed implementation 3 years ago.</div>' +
          '<div class="drag-chip" data-chip-id="s06-task">Create a 10-question stakeholder survey to identify root causes of resistance</div>' +
          '<div class="drag-chip" data-chip-id="s06-format">Output as a numbered list, professional tone, no preamble, max 15 words per question</div>' +
        '</div>' +
        '<div class="drop-zones-grid">' +
          '<div class="drop-zone" data-zone="role"><div class="drop-zone-header"><span class="drop-zone-pill">Role</span></div><div class="drop-zone-placeholder">Drop here</div></div>' +
          '<div class="drop-zone" data-zone="context"><div class="drop-zone-header"><span class="drop-zone-pill">Context</span></div><div class="drop-zone-placeholder">Drop here</div></div>' +
          '<div class="drop-zone" data-zone="task"><div class="drop-zone-header"><span class="drop-zone-pill">Task</span></div><div class="drop-zone-placeholder">Drop here</div></div>' +
          '<div class="drop-zone" data-zone="format"><div class="drop-zone-header"><span class="drop-zone-pill">Format</span></div><div class="drop-zone-placeholder">Drop here</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="stagger-4" style="display:flex;gap:var(--space-md);flex-wrap:wrap;">' +
        '<button class="btn btn-primary" id="s06-check-btn" disabled>Check Answers</button>' +
        '<button class="btn btn-secondary" id="s06-reset-btn" style="display:none;">Reset</button>' +
      '</div>' +
      '<div id="s06-feedback" class="stagger-5"></div>' +
      '<div id="s06-summary" style="display:none;"></div>';
  };

  // ─── SLIDE 07: Card Flip — Role & Context ───
  slides[6] = function() {
    return '' +
      '<div class="slide-eyebrow stagger-1">STRUCTURED PROMPTING</div>' +
      '<h2 class="slide-heading stagger-2">Role & Context \u2014 <span class="accent">in depth</span></h2>' +
      '<p class="slide-intro stagger-3">Click each card to flip between the prompt \u2014 and the AI response it generates.</p>' +
      '<div class="flip-card-grid stagger-4" id="slide07-cards">' +
        // Card 1: ROLE
        '<div class="flip-card-wrap">' +
          '<div class="flip-card" id="flip-07-role">' +
            '<div class="flip-card-face flip-card-front">' +
              '<span class="badge badge-without">WITHOUT ROLE</span>' +
              '<div class="prompt-box bad" style="margin:var(--space-md) 0;font-size:13px;">\u201CWrite a stakeholder communication about our system migration.\u201D</div>' +
              '<div class="flip-card-separator"></div>' +
              '<div class="flip-card-label">AI RESPONSE PREVIEW</div>' +
              '<div class="response-preview">\u201CHere is a stakeholder communication about your system migration: Dear Team, we wanted to update you on the ongoing system migration...\u201D</div>' +
              '<div class="flip-hint">Click to flip \u21BA</div>' +
            '</div>' +
            '<div class="flip-card-face flip-card-back">' +
              '<span class="badge badge-with">WITH ROLE</span>' +
              '<div class="prompt-box good" style="margin:var(--space-md) 0;font-size:13px;">\u201CYou are the Head of Internal Communications at a global pharma company with 20,000 employees. Write a stakeholder communication about our ERP migration.\u201D</div>' +
              '<div class="flip-card-separator"></div>' +
              '<div class="flip-card-label">AI RESPONSE PREVIEW</div>' +
              '<div class="response-preview">\u201CSubject: An Important Update on Our ERP Transition. Dear Colleagues, I\'m writing to you directly because I know this transition touches every one of your workflows...\u201D</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // Card 2: CONTEXT
        '<div class="flip-card-wrap">' +
          '<div class="flip-card" id="flip-07-context">' +
            '<div class="flip-card-face flip-card-front">' +
              '<span class="badge badge-without">WITHOUT CONTEXT</span>' +
              '<div class="prompt-box bad" style="margin:var(--space-md) 0;font-size:13px;">\u201CHelp me prepare talking points for a difficult leadership conversation.\u201D</div>' +
              '<div class="flip-card-separator"></div>' +
              '<div class="flip-card-label">AI RESPONSE PREVIEW</div>' +
              '<div class="response-preview">\u201CHere are some general talking points for a difficult leadership conversation: 1. Start by acknowledging the other person\'s perspective...\u201D</div>' +
              '<div class="flip-hint">Click to flip \u21BA</div>' +
            '</div>' +
            '<div class="flip-card-face flip-card-back">' +
              '<span class="badge badge-with">WITH CONTEXT</span>' +
              '<div class="prompt-box good" style="margin:var(--space-md) 0;font-size:13px;">\u201CHelp me prepare talking points for a conversation with a CFO who is sceptical about our change management proposal. She previously approved a failed implementation and is now very risk-averse.\u201D</div>' +
              '<div class="flip-card-separator"></div>' +
              '<div class="flip-card-label">AI RESPONSE PREVIEW</div>' +
              '<div class="response-preview">\u201CGiven her context, I\'d lead with risk mitigation rather than opportunity. Here are five specific talking points: 1. Acknowledge the previous experience directly...\u201D</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="slide07-insight" class="insight-box stagger-5" style="opacity:0;transition:opacity 400ms ease;">The same task. Completely different outputs. Role and Context don\'t constrain the AI \u2014 they give it the information it needs to think like someone relevant to your situation.</div>';
  };

  // ─── SLIDE 08: Task & Format Deep Dive ───
  slides[7] = function() {
    return '' +
      '<div class="slide-eyebrow stagger-1">STRUCTURED PROMPTING</div>' +
      '<h2 class="slide-heading stagger-2">Task & Format \u2014 <span class="accent">in depth</span></h2>' +
      // Task panel
      '<div class="content-panel stagger-3">' +
        '<div class="panel-header">' +
          '<span class="color-pill color-pill--task">TASK</span>' +
          '<span style="font-size:16px;font-weight:600;color:var(--color-navy);">Clarity of instruction = clarity of output</span>' +
        '</div>' +
        '<p style="font-size:15px;color:var(--color-text-body);line-height:1.7;margin-bottom:var(--space-lg);">The task is the most important element. A vague task is the single biggest reason AI outputs disappoint.</p>' +
        '<div style="border-left:4px solid var(--color-task);background:var(--color-task-light);padding:var(--space-md) var(--space-lg);border-radius:0 var(--radius-sm) var(--radius-sm) 0;margin-bottom:var(--space-lg);font-size:14px;color:var(--color-navy-mid);line-height:1.6;">' +
          '<strong>The newspaper editor test:</strong> Before finalising your task instruction, ask: would a stranger understand exactly what I want, with zero additional context? If not, make it more specific.' +
        '</div>' +
        '<div style="font-size:13px;font-weight:600;color:var(--color-error);margin-bottom:6px;">VAGUE TASK:</div>' +
        '<div class="prompt-box bad" style="margin-bottom:var(--space-md);">\u201CHelp me with my presentation\u201D</div>' +
        '<div style="font-size:13px;font-weight:600;color:var(--color-success);margin-bottom:6px;">SPECIFIC TASK:</div>' +
        '<div class="prompt-box good">\u201CCreate a 5-slide outline for a 20-minute presentation to a CFO audience explaining why our change management approach differs from standard consulting. Include a recommended narrative arc and one suggested data point per slide.\u201D</div>' +
      '</div>' +
      // Format panel
      '<div class="content-panel stagger-4">' +
        '<div class="panel-header">' +
          '<span class="color-pill color-pill--format">FORMAT</span>' +
          '<span style="font-size:16px;font-weight:600;color:var(--color-navy);">Don\'t leave the structure to chance</span>' +
        '</div>' +
        '<p style="font-size:15px;color:var(--color-text-body);line-height:1.7;margin-bottom:var(--space-lg);">Specifying format transforms how usable the output is. It\'s the difference between getting something you can paste directly versus something you have to heavily rewrite.</p>' +
        '<div class="tag-grid">' +
          '<span class="format-tag">Bullet points</span>' +
          '<span class="format-tag">Numbered list</span>' +
          '<span class="format-tag">Table</span>' +
          '<span class="format-tag">Paragraph prose</span>' +
          '<span class="format-tag">Executive summary</span>' +
          '<span class="format-tag">Word limit: 200 words</span>' +
          '<span class="format-tag">Tone: formal</span>' +
          '<span class="format-tag">Tone: conversational</span>' +
          '<span class="format-tag">No preamble</span>' +
          '<span class="format-tag">Include headers</span>' +
        '</div>' +
      '</div>';
  };

  // ─── SLIDE 09: Chain of Thought ───
  slides[8] = function() {
    return '' +
      '<div class="slide-eyebrow stagger-1">ADVANCED TECHNIQUES</div>' +
      '<h2 class="slide-heading stagger-2">Chain of Thought \u2014 <span class="accent">show your reasoning</span></h2>' +
      '<p class="slide-intro stagger-3">Standard prompting asks for an answer. Chain of Thought prompting asks for the reasoning behind the answer.</p>' +
      '<div class="steps-row stagger-4">' +
        '<div class="step-item"><div class="step-icon">' + icon('message-square', 24, '#38B2AC') + '</div><div class="step-label">You ask the question</div></div>' +
        '<div class="step-connector">' + icon('arrow-right', 20, '#A0AEC0') + '</div>' +
        '<div class="step-item"><div class="step-icon">' + icon('git-branch', 24, '#38B2AC') + '</div><div class="step-label">You instruct: \u201CThink step by step\u201D</div></div>' +
        '<div class="step-connector">' + icon('arrow-right', 20, '#A0AEC0') + '</div>' +
        '<div class="step-item"><div class="step-icon">' + icon('file-text', 24, '#38B2AC') + '</div><div class="step-label">AI shows reasoning, then concludes</div></div>' +
      '</div>' +
      '<div class="card-grid card-grid-2 stagger-5">' +
        '<div>' +
          '<div style="font-size:13px;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;margin-bottom:8px;">WITHOUT Chain of Thought</div>' +
          '<div class="prompt-box bad">\u201CShould we prioritise change management in Wave 1 or Wave 2 of the ERP rollout?\u201D</div>' +
          '<div class="prompt-annotation">' + icon('info', 14, '#A0AEC0') + ' Direct answer \u2014 no reasoning visible</div>' +
        '</div>' +
        '<div>' +
          '<div style="font-size:13px;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;margin-bottom:8px;">WITH Chain of Thought</div>' +
          '<div class="prompt-box good">\u201CShould we prioritise change management in Wave 1 or Wave 2 of the ERP rollout? Think through this step by step, considering the risks and stakeholder dynamics, before giving your recommendation.\u201D</div>' +
          '<div class="prompt-annotation">' + icon('check-circle', 14, '#48BB78') + ' Reasoning visible \u2014 you can evaluate the logic</div>' +
        '</div>' +
      '</div>' +
      '<div class="insight-box">Chain of Thought is especially valuable in consulting and advisory work \u2014 it lets you use AI as a thinking partner, not just an answer machine.</div>';
  };

  // ─── SLIDE 10: Flippable Technique Cards ───
  slides[9] = function() {
    var techniques = [
      { id: 'flip-10-1', icon: 'refresh-cw', name: 'Few-Shot Prompting', hook: 'Give examples \u2014 the AI matches the pattern', when: 'When you have a very specific output format that\'s easier to show than describe. Most effective for writing tasks with a strong house style.', example: '\u201CHere are two examples of how we write client emails: [Ex1] [Ex2]. Now write one for [new scenario] using the same tone.\u201D' },
      { id: 'flip-10-2', icon: 'copy', name: 'Iterative Prompting', hook: 'Refine through conversation, not one-shot requests', when: 'For complex outputs that need multiple rounds \u2014 reports, strategies, frameworks. Treat each response as a draft, not a deliverable.', example: '\u201CGood first draft. Now make the executive summary 30% shorter and replace all jargon with plain language. Keep everything else identical.\u201D' },
      { id: 'flip-10-3', icon: 'slash', name: 'Constraint Prompting', hook: 'Tell it what NOT to do \u2014 often more powerful', when: 'When AI outputs consistently include something unwanted. Negative constraints are frequently more effective than positive instructions alone.', example: '\u201CDo not use jargon. Do not start with \'As an AI\'. Do not add disclaimers. Do not include a preamble \u2014 begin with the first point directly.\u201D' },
      { id: 'flip-10-4', icon: 'layers', name: 'Persona Stacking', hook: 'Assign multiple roles to stress-test ideas', when: 'For balanced analysis or simulating stakeholder reactions. Ask the AI to evaluate its own output from a different perspective.', example: '\u201CYou just wrote this proposal as a consultant. Now review it as a sceptical CFO and identify the three weakest points in the business case.\u201D' }
    ];

    var html = '' +
      '<div class="slide-eyebrow stagger-1">ADVANCED TECHNIQUES</div>' +
      '<h2 class="slide-heading stagger-2">Four more techniques \u2014 <span class="accent">build your instincts</span></h2>' +
      '<p class="slide-intro stagger-3">Click each card to explore when to use it and see a concrete example.</p>' +
      '<div class="flip-card-grid-4 stagger-4" id="slide10-cards">';

    for (var i = 0; i < techniques.length; i++) {
      var t = techniques[i];
      html += '<div class="flip-card-wrap">' +
        '<div class="flip-card" id="' + t.id + '">' +
          '<div class="flip-card-face flip-card-front">' +
            '<div style="display:flex;justify-content:space-between;align-items:start;">' +
              '<div>' + icon(t.icon, 24, '#38B2AC') + '</div>' +
              '<div class="number-badge">' + (i + 1) + '</div>' +
            '</div>' +
            '<div class="card-title" style="margin-top:var(--space-md);">' + t.name + '</div>' +
            '<div style="font-size:13px;color:var(--color-text-light);line-height:1.5;">' + t.hook + '</div>' +
            '<div class="flip-hint">Click to explore \u21BA</div>' +
          '</div>' +
          '<div class="flip-card-face flip-card-back">' +
            '<div class="slide-eyebrow" style="margin-bottom:var(--space-sm);">WHEN TO USE</div>' +
            '<div style="font-size:13px;color:var(--color-text-body);line-height:1.5;margin-bottom:var(--space-md);">' + t.when + '</div>' +
            '<div class="flip-card-separator"></div>' +
            '<div class="slide-eyebrow" style="margin-bottom:var(--space-sm);">EXAMPLE</div>' +
            '<div class="prompt-box neutral" style="font-size:12px;">' + t.example + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    html += '</div>' +
      '<div class="stagger-5" style="text-align:center;">' +
        '<button class="btn btn-secondary" id="s10-flip-all-btn">Explore all techniques \u21BA</button>' +
      '</div>';

    return html;
  };

  // ─── SLIDE 11: Three-Format Quiz ───
  slides[10] = function() {
    return '' +
      '<div class="slide-eyebrow stagger-1">PRACTICE</div>' +
      '<h2 class="slide-heading stagger-2">Check your <span class="accent">understanding</span></h2>' +
      '<p class="slide-intro stagger-3">Three different question formats. No pressure \u2014 this is about reinforcing what you\'ve learned.</p>' +
      '<div id="quiz-container" class="stagger-4"></div>';
  };

  // ─── SLIDE 12: Same Task, Three Approaches ───
  slides[11] = function() {
    var tab = state.activeTab || 'braindump';
    return '' +
      '<div class="slide-eyebrow stagger-1">PRACTICE</div>' +
      '<h2 class="slide-heading stagger-2">Same task. Three <span class="accent">approaches</span>.</h2>' +
      '<p class="slide-intro stagger-3">See how the same scenario produces different results depending on the technique.</p>' +
      '<div class="scenario-box stagger-4"><strong>The Scenario:</strong> You\'re a consultant preparing a stakeholder briefing for a pharma client ahead of a change management workshop. You need AI help.</div>' +
      '<div class="tab-bar stagger-5">' +
        '<button class="tab-btn' + (tab === 'braindump' ? ' active' : '') + '" data-tab="braindump">Brain Dump</button>' +
        '<button class="tab-btn' + (tab === 'rctf' ? ' active' : '') + '" data-tab="rctf">RCTF Framework</button>' +
        '<button class="tab-btn' + (tab === 'cot' ? ' active' : '') + '" data-tab="cot">Chain of Thought</button>' +
      '</div>' +
      // Tab 1: Brain Dump
      '<div class="tab-panel' + (tab === 'braindump' ? ' active' : '') + '" data-panel="braindump">' +
        '<div class="prompt-box good">\u201COkay so I\'ve got a client workshop in 3 days, pharma company, they\'re rolling out a new LMS and nobody wants to use it, there\'s been 3 failed tech rollouts in 5 years so people are cynical, the L&amp;D director is supportive but the line managers are the blockers, I need to help the leadership team get aligned on what to do... can you help me think through what I should cover and how to frame it?\u201D</div>' +
        '<div class="prompt-annotation">' + icon('check-circle', 14, '#48BB78') + ' Works because: all context is captured, AI can find the structure</div>' +
      '</div>' +
      // Tab 2: RCTF (with diff highlighting)
      '<div class="tab-panel' + (tab === 'rctf' ? ' active' : '') + '" data-panel="rctf">' +
        '<div class="prompt-box good">' +
          '<span class="rctf-label rctf-label--role">ROLE</span> <span class="diff-add">\u201CYou are a senior change management consultant...\u201D</span><br><br>' +
          '<span class="rctf-label rctf-label--context">CONTEXT</span> \u201CClient is a global pharma company 3 weeks into an LMS rollout. Three previous tech failures have created change fatigue. L&amp;D director is supportive; line managers are resistant...\u201D<br><br>' +
          '<span class="rctf-label rctf-label--task">TASK</span> <span class="diff-add">\u201CCreate a stakeholder briefing structure for a 2-hour leadership alignment workshop...\u201D</span><br><br>' +
          '<span class="rctf-label rctf-label--format">FORMAT</span> <span class="diff-add">\u201CPresent as: 1) Workshop objectives (3 bullets), 2) Recommended agenda with timings, 3) Key facilitation principles (4 max). Professional tone, no jargon.\u201D</span>' +
        '</div>' +
        '<div class="prompt-annotation">' + icon('check-circle', 14, '#48BB78') + ' Works because: consistent, repeatable, shareable as a team template</div>' +
      '</div>' +
      // Tab 3: Chain of Thought (with diff highlighting)
      '<div class="tab-panel' + (tab === 'cot' ? ' active' : '') + '" data-panel="cot">' +
        '<div class="prompt-box good">\u201CI\'m preparing a leadership alignment workshop for a pharma client with significant change fatigue. <span class="diff-add">Before giving me a workshop structure, think step by step through: what are the psychological dynamics at play, what mistakes most consultants make in this situation, and what principles should guide the design.</span> Then give me your recommended approach.\u201D</div>' +
        '<div class="prompt-annotation">' + icon('check-circle', 14, '#48BB78') + ' Works because: reasoning is visible, can be challenged and refined</div>' +
      '</div>' +
      '<p style="font-size:14px;color:var(--color-text-light);margin-top:var(--space-lg);line-height:1.6;">Notice that all three prompts produce useful output \u2014 but for different reasons. The skill is choosing which one fits your situation.</p>';
  };

  // ─── SLIDE 13: Branching Consequence Scenario ───
  slides[12] = function() {
    return '' +
      '<div class="slide-eyebrow stagger-1">PRACTICE</div>' +
      '<h2 class="slide-heading stagger-2">Your <span class="accent">turn</span></h2>' +
      '<p class="slide-intro stagger-3">Choose an approach below and see what the AI actually produces.</p>' +
      '<div class="scenario-box stagger-4"><strong>Scenario:</strong> ' + CHALLENGE.scenario + '</div>' +
      '<p style="font-size:15px;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-md);" class="stagger-4">' + CHALLENGE.question + '</p>' +
      '<div id="challenge-container" class="stagger-5"></div>';
  };

  // ─── SLIDE 14: Prompt Starter Kit + Builder ───
  slides[13] = function() {
    var html = '' +
      '<div class="slide-eyebrow stagger-1">YOUR TOOLKIT</div>' +
      '<h2 class="slide-heading stagger-2">Your prompt <span class="accent">starter kit</span></h2>' +
      '<p class="slide-intro stagger-3">Five reusable prompt templates for the situations you encounter most. Copy them, adapt them to your context.</p>';

    for (var i = 0; i < TEMPLATES.length; i++) {
      var t = TEMPLATES[i];
      html += '<div class="template-card stagger-4">' +
        '<div class="template-card-header">' +
          '<span class="color-pill ' + t.tagClass + '">' + t.tag + '</span>' +
          '<button class="copy-btn" data-copy-index="' + i + '">' + icon('copy', 14, 'currentColor') + ' Copy</button>' +
        '</div>' +
        '<div class="template-usecase">' + t.useCase + '</div>' +
        '<div class="template-text">' + escapeHTML(t.text) + '</div>' +
      '</div>';
    }

    // Builder section
    html += '<div class="builder-section stagger-5">' +
      '<h3 class="slide-heading" style="font-size:22px;">Build your own template \u2014 30 seconds</h3>' +
      '<div class="builder-controls">' +
        '<div><label class="builder-label">Technique</label>' +
          '<select class="builder-select" id="builder-technique">' +
            '<option value="braindump">Brain Dump</option>' +
            '<option value="rctf" selected>RCTF</option>' +
            '<option value="cot">Chain of Thought</option>' +
            '<option value="fewshot">Few-Shot</option>' +
            '<option value="iterative">Iterative</option>' +
          '</select></div>' +
        '<div><label class="builder-label">Use Case</label>' +
          '<select class="builder-select" id="builder-usecase">' +
            '<option value="meeting">Client Meeting Prep</option>' +
            '<option value="research">Research Summary</option>' +
            '<option value="email">Stakeholder Email</option>' +
            '<option value="workshop">Workshop Design</option>' +
            '<option value="proposal">Proposal Draft</option>' +
            '<option value="data">Data Analysis Request</option>' +
          '</select></div>' +
        '<div><label class="builder-label">Output Format</label>' +
          '<select class="builder-select" id="builder-format">' +
            '<option value="bullets">Bullet Points</option>' +
            '<option value="numbered">Numbered List</option>' +
            '<option value="report">Structured Report</option>' +
            '<option value="summary">Executive Summary</option>' +
            '<option value="table">Table</option>' +
          '</select></div>' +
      '</div>' +
      '<label class="builder-label">Context (optional)</label>' +
      '<textarea class="builder-context" id="builder-context" placeholder="Add any specific context about your situation (optional \u2014 but makes the template much more relevant)"></textarea>' +
      '<div style="margin-top:var(--space-md);">' +
        '<button class="btn btn-primary" id="builder-generate">Generate Template</button>' +
      '</div>' +
      '<div class="builder-output" id="builder-output"></div>' +
    '</div>';

    return html;
  };

  // ─── SLIDE 15: Completion with Confidence Delta ───
  slides[14] = function() {
    var quizScore = window.QuizEngine ? window.QuizEngine.getScore() : { correct: 0, total: 3 };
    var pct = Math.round((quizScore.correct / quizScore.total) * 100);
    var hasConfidenceOpen = state.confidenceOpen !== null;

    var html = '<div style="text-align:center;">' +
      '<div class="completion-mark stagger-1">' + icon('check-circle', 40, '#fff') + '</div>' +
      '<div class="completion-label stagger-2">Module Complete</div>' +
      '<h2 class="completion-heading stagger-2">You\'ve completed Level 1</h2>' +
      '<div class="pull-quote stagger-3" style="text-align:left;max-width:600px;margin:var(--space-lg) auto;">' +
        '\u201CThe best prompters don\'t follow one formula \u2014 they match their approach to the situation. You now have the foundations to do exactly that.\u201D' +
      '</div>' +
      '<div class="stagger-4" style="text-align:left;max-width:640px;margin:var(--space-xl) auto;">' +
        '<div style="font-size:14px;font-weight:700;color:var(--color-navy);margin-bottom:var(--space-md);">What you\'ve learned:</div>' +
        '<div>' +
          '<div class="summary-item">' + icon('check', 16, '#38B2AC') + ' The difference between free-form and structured prompting</div>' +
          '<div class="summary-item">' + icon('check', 16, '#38B2AC') + ' The RCTF framework and when to use it</div>' +
          '<div class="summary-item">' + icon('check', 16, '#38B2AC') + ' Chain of Thought, Few-Shot, Iterative, and Constraint techniques</div>' +
          '<div class="summary-item">' + icon('check', 16, '#38B2AC') + ' How to construct a brain dump prompt</div>' +
          '<div class="summary-item">' + icon('check', 16, '#38B2AC') + ' A starter kit of 5 reusable templates</div>' +
        '</div>' +
      '</div>';

    // Quiz score
    if (window.QuizEngine && window.QuizEngine.isComplete()) {
      html += '<div class="stagger-4" style="margin:var(--space-md) 0;font-size:14px;color:var(--color-text-light);">Your quiz score: ' + quizScore.correct + ' / ' + quizScore.total + '</div>';
    }

    // Confidence delta panel
    if (hasConfidenceOpen) {
      html += '<div class="confidence-delta-panel stagger-4" style="max-width:640px;margin:var(--space-xl) auto;text-align:center;">' +
        '<div class="confidence-delta-header">YOUR CONFIDENCE JOURNEY</div>';

      if (state.confidenceClose !== null) {
        var delta = state.confidenceClose - state.confidenceOpen;
        var deltaMsg = '';
        if (delta >= 2) deltaMsg = 'Your confidence grew by ' + delta + ' points. That\'s the foundation building.';
        else if (delta === 1) deltaMsg = 'Even a small shift in confidence matters. Keep using these techniques and it will compound.';
        else deltaMsg = 'Confidence sometimes dips when you realise how much there is to learn. That\'s a sign you\'re thinking more carefully \u2014 which is exactly right.';

        html += '<div class="confidence-delta-row">' +
          '<div class="confidence-score-box"><div class="confidence-score-num">' + state.confidenceOpen + '</div><div class="confidence-score-label">BEFORE</div></div>' +
          '<div class="confidence-arrow">\u2192</div>' +
          '<div class="confidence-score-box"><div class="confidence-score-num">' + state.confidenceClose + '</div><div class="confidence-score-label">AFTER</div></div>' +
        '</div>' +
        '<div class="confidence-delta-message">' + deltaMsg + '</div>';
      } else {
        // Show closing slider
        html += '<div style="text-align:left;">' +
          '<p style="font-size:14px;color:var(--color-text-body);margin-bottom:var(--space-md);">Now rate your confidence again \u2014 after completing the module:</p>' +
          '<div class="confidence-slider-wrap">' +
            '<div class="confidence-scale"><span>Not confident at all</span><span>Somewhat confident</span><span>Very confident</span></div>' +
            '<input type="range" class="confidence-input" id="closing-confidence" min="1" max="10" value="' + (state.confidenceOpen || 5) + '" style="--fill-percent: ' + (((state.confidenceOpen || 5) - 1) / 9 * 100) + '%">' +
            '<div class="confidence-value-display" id="closing-confidence-value">' + (state.confidenceOpen || 5) + '</div>' +
          '</div>' +
          '<div style="text-align:center;margin-top:var(--space-md);">' +
            '<button class="btn btn-primary" id="closing-confidence-submit">Submit Confidence Rating</button>' +
          '</div>' +
        '</div>';
      }

      html += '</div>';
    }

    // CTA cards
    html += '<div class="cta-cards stagger-5" style="max-width:640px;margin:var(--space-xl) auto;text-align:left;">' +
      '<div class="cta-card cta-card--primary">' +
        '<div class="cta-card-icon">' + icon('arrow-right', 24, '#fff') + '</div>' +
        '<div class="cta-card-title">Continue to Level 2</div>' +
        '<div class="cta-card-body">Build your first custom AI agent \u2014 tools others on your team can reuse.</div>' +
        '<div class="cta-card-note" style="color:rgba(255,255,255,0.6);">Available in your LMS</div>' +
      '</div>' +
      '<div class="cta-card cta-card--secondary">' +
        '<div class="cta-card-icon">' + icon('download', 24, '#1A202C') + '</div>' +
        '<div class="cta-card-title">Download Prompt Templates</div>' +
        '<div class="cta-card-body">Save your starter kit as a printable reference.</div>' +
        '<button class="btn btn-secondary" style="margin-top:12px;" id="print-templates-btn">Download</button>' +
      '</div>' +
    '</div>' +
    '<div class="footer-brand stagger-5">' +
      '<img src="assets/logo.png" alt="OXYGY" style="height:28px;">' +
      '<div class="footer-brand-text">Part of the OXYGY AI Upskilling Framework \u2014 Level 1 of 5</div>' +
    '</div>' +
    '</div>';

    return html;
  };

  // ═══════════════════════════════════════════════════════════════
  // SECTION 5: NAVIGATION & RENDERING
  // ═══════════════════════════════════════════════════════════════

  function renderProgressBar() {
    var fill = document.getElementById('progress-fill');
    var label = document.getElementById('progress-label');
    if (!fill || !label) return;
    var pct = ((state.currentSlide + 1) / TOTAL_SLIDES) * 100;
    fill.style.width = pct + '%';
    label.textContent = 'Slide ' + (state.currentSlide + 1) + ' of ' + TOTAL_SLIDES;
  }

  function renderBottomNav() {
    var nav = document.getElementById('slide-nav');
    if (!nav) return;
    var idx = state.currentSlide;
    var section = SECTIONS[idx] || '';

    var prevBtn = idx > 0 ?
      '<button class="btn btn-secondary" onclick="CourseNav.prev()">' + icon('chevron-left', 16) + ' Previous</button>' :
      '<div></div>';

    var nextDisabled = !canAdvance();
    var nextLabel = idx === TOTAL_SLIDES - 1 ? 'Complete Module' : 'Next';
    var nextBtn = '<button class="btn btn-primary"' +
      (nextDisabled ? ' disabled' : '') +
      ' onclick="CourseNav.next()">' +
      nextLabel + ' ' + icon('chevron-right', 16, '#fff') +
      '</button>';

    nav.innerHTML = prevBtn +
      '<span class="nav-section-label">' + section + '</span>' +
      nextBtn;
  }

  function canAdvance() {
    var idx = state.currentSlide;
    // Quiz slide: must complete all 3 questions
    if (idx === 10 && window.QuizEngine && !window.QuizEngine.isComplete()) return false;
    // Slide 06: must check answers
    if (idx === 5 && !state.slide06Completed) return false;
    return true;
  }

  function renderSlide() {
    var container = document.getElementById('slide-container');
    var renderer = slides[state.currentSlide];
    if (!renderer || !container) return;

    container.innerHTML = renderer();
    renderProgressBar();
    renderBottomNav();

    // Post-render hooks
    postRenderHooks();

    // Scroll content to top
    var content = document.getElementById('course-content');
    if (content) content.scrollTop = 0;

    // Focus management
    var heading = container.querySelector('h1, h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      setTimeout(function() { heading.focus({ preventScroll: true }); }, 100);
    }
  }

  function postRenderHooks() {
    var idx = state.currentSlide;

    // Slide 03: Spectrum slider
    if (idx === 2) {
      window.SpectrumSlider.init({
        instanceId: 'slide03',
        trackId: 'spectrum-track',
        handleId: 'spectrum-handle',
        panelId: 'technique-panel',
        initialPosition: state.slide03Position,
        positions: [
          { name: 'Brain Dump', min: 0, max: 33, when: 'Best when your thinking is unstructured \u2014 you have context but haven\'t formed your request yet. Let the AI find the pattern.', example: '\u201COkay so I\'m preparing for a client meeting next Tuesday, pharma company, they\'re rolling out a new ERP and the teams are resistant, there was a failed implementation 3 years ago... what should I be thinking about?\u201D' },
          { name: 'Conversational / Iterative', min: 34, max: 66, when: 'Best for exploratory tasks where you want to refine through dialogue. Start with a rough ask and build through follow-up messages.', example: '\u201CHelp me think through the structure for a change management workshop. [AI responds] Good \u2014 can you make it more specific to a pharma ERP context? [continue iterating...]\u201D' },
          { name: 'Structured / RCTF', min: 67, max: 100, when: 'Best when you need a consistent, repeatable output \u2014 especially for tasks your team will run multiple times or share as a template.', example: '\u201CYou are a senior change management consultant [Role]. We are 6 weeks into an ERP rollout with resistant commercial teams [Context]. Create a 10-question stakeholder survey [Task]. Output as a numbered list, professional tone [Format].\u201D' }
        ],
        onPositionChange: function(posIdx, pct) {
          state.slide03Position = pct;
        }
      });
    }

    // Slide 06: Drag and drop
    if (idx === 5) {
      window.DragDropEngine.init({
        instanceId: 'slide06',
        containerId: 'slide06-dd',
        chips: [
          { id: 's06-role', text: 'You are a senior change management consultant with pharma experience', correctZone: 'role' },
          { id: 's06-context', text: 'We are 6 weeks into an ERP rollout at a global pharma company. Teams are resistant due to a failed implementation 3 years ago.', correctZone: 'context' },
          { id: 's06-task', text: 'Create a 10-question stakeholder survey to identify root causes of resistance', correctZone: 'task' },
          { id: 's06-format', text: 'Output as a numbered list, professional tone, no preamble, max 15 words per question', correctZone: 'format' }
        ],
        zones: [
          { id: 'role', label: 'Role' },
          { id: 'context', label: 'Context' },
          { id: 'task', label: 'Task' },
          { id: 'format', label: 'Format' }
        ],
        onAllPlaced: function() {
          var btn = document.getElementById('s06-check-btn');
          if (btn) btn.disabled = false;
        },
        onCheck: function(results) {
          state.slide06Completed = true;
          renderBottomNav();

          var fb = document.getElementById('s06-feedback');
          var resetBtn = document.getElementById('s06-reset-btn');
          var summary = document.getElementById('s06-summary');

          if (results.correct === results.total) {
            if (fb) fb.innerHTML = '<div class="success-panel" style="margin-top:var(--space-md);">Perfect \u2014 you\'ve mapped the full RCTF prompt correctly.</div>';
          } else {
            if (fb) fb.innerHTML = '<div class="error-panel" style="margin-top:var(--space-md);">You got ' + results.correct + '/4 correct. Review the highlighted zones and try again?</div>';
            if (resetBtn) {
              resetBtn.style.display = '';
              resetBtn.onclick = function() {
                window.DragDropEngine.reset('slide06');
                var checkBtn = document.getElementById('s06-check-btn');
                if (checkBtn) { checkBtn.disabled = true; checkBtn.textContent = 'Check Answers'; }
                if (fb) fb.innerHTML = '';
                if (summary) summary.style.display = 'none';
                resetBtn.style.display = 'none';
              };
            }
          }

          // Show RCTF summary
          if (summary) {
            summary.style.display = 'block';
            summary.innerHTML = '<div class="rctf-summary-row">' +
              '<div class="rctf-summary-item"><span class="color-pill color-pill--role">Role</span><div class="rctf-summary-desc">Who the AI should be</div></div>' +
              '<div class="rctf-summary-item"><span class="color-pill color-pill--context">Context</span><div class="rctf-summary-desc">Your specific situation</div></div>' +
              '<div class="rctf-summary-item"><span class="color-pill color-pill--task">Task</span><div class="rctf-summary-desc">Exactly what to produce</div></div>' +
              '<div class="rctf-summary-item"><span class="color-pill color-pill--format">Format</span><div class="rctf-summary-desc">How to structure it</div></div>' +
            '</div>';
          }
        },
        feedbackMap: {
          's06-role':    { correct: '\u2713 Correct!', incorrect: 'This is the Role \u2014 the persona you assign.' },
          's06-context': { correct: '\u2713 Correct!', incorrect: 'This is the Context \u2014 your specific situation.' },
          's06-task':    { correct: '\u2713 Correct!', incorrect: 'This is the Task \u2014 what you want produced.' },
          's06-format':  { correct: '\u2713 Correct!', incorrect: 'This is the Format \u2014 how to structure the output.' }
        }
      });

      var checkBtn = document.getElementById('s06-check-btn');
      if (checkBtn) {
        checkBtn.addEventListener('click', function() {
          window.DragDropEngine.checkAnswers('slide06');
        });
      }
    }

    // Slide 07: Flip cards
    if (idx === 6) {
      window.CardFlipEngine.init({
        instanceId: 'slide07',
        containerId: 'slide07-cards',
        cardIds: ['flip-07-role', 'flip-07-context'],
        onAllFlipped: function() {
          state.slide07AllFlipped = true;
          var insight = document.getElementById('slide07-insight');
          if (insight) insight.style.opacity = '1';
        }
      });
    }

    // Slide 10: Flip cards (4)
    if (idx === 9) {
      var cardIds10 = ['flip-10-1', 'flip-10-2', 'flip-10-3', 'flip-10-4'];
      window.CardFlipEngine.init({
        instanceId: 'slide10',
        containerId: 'slide10-cards',
        cardIds: cardIds10,
        onAllFlipped: function() {
          state.slide10AllFlipped = true;
          var btn = document.getElementById('s10-flip-all-btn');
          if (btn) btn.textContent = 'Reset cards';
          renderBottomNav();
        }
      });

      var flipAllBtn = document.getElementById('s10-flip-all-btn');
      if (flipAllBtn) {
        flipAllBtn.addEventListener('click', function() {
          if (window.CardFlipEngine.allFlipped('slide10')) {
            window.CardFlipEngine.resetAll('slide10');
            flipAllBtn.textContent = 'Explore all techniques \u21BA';
          } else {
            window.CardFlipEngine.flipAll('slide10');
          }
        });
      }
    }

    // Slide 11: Quiz
    if (idx === 10) {
      if (state.quizState) {
        window.QuizEngine.restoreState(state.quizState);
      }
      window.QuizEngine.init('quiz-container');
    }

    // Slide 12: Tab handling is via event delegation (see handleClicks)

    // Slide 13: Challenge
    if (idx === 12) {
      renderChallenge();
    }

    // Slide 14: Builder
    if (idx === 13) {
      initBuilder();
    }

    // Slide 15: Confidence close + print
    if (idx === 14) {
      // Capture confidence from quiz
      if (state.confidenceOpen === null && window.QuizEngine) {
        state.confidenceOpen = window.QuizEngine.getConfidenceOpen();
      }

      // Re-render slide if confidence was just captured
      var closingSlider = document.getElementById('closing-confidence');
      if (closingSlider) {
        closingSlider.addEventListener('input', function() {
          var val = parseInt(closingSlider.value);
          var fillPct = ((val - 1) / 9) * 100;
          closingSlider.style.setProperty('--fill-percent', fillPct + '%');
          var display = document.getElementById('closing-confidence-value');
          if (display) display.textContent = val;
        });
      }

      var submitBtn = document.getElementById('closing-confidence-submit');
      if (submitBtn) {
        submitBtn.addEventListener('click', function() {
          var slider = document.getElementById('closing-confidence');
          if (slider) {
            state.confidenceClose = parseInt(slider.value);
            saveProgress();
            completeModule();
            renderSlide(); // Re-render to show delta
          }
        });
      }

      var printBtn = document.getElementById('print-templates-btn');
      if (printBtn) {
        printBtn.addEventListener('click', printTemplates);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 6: CHALLENGE ENGINE (Slide 13)
  // ═══════════════════════════════════════════════════════════════

  function renderChallenge() {
    var container = document.getElementById('challenge-container');
    if (!container) return;

    var html = '';
    for (var i = 0; i < CHALLENGE.options.length; i++) {
      var opt = CHALLENGE.options[i];
      var isSelected = state.challengeSelected === i;
      var cls = 'option-card';
      if (state.challengeConfirmed) {
        if (isSelected && opt.quality === 'best') cls += ' correct';
        else if (isSelected) cls += ' incorrect';
        else cls += ' disabled';
      } else if (isSelected) {
        cls += ' selected';
      }

      html += '<div class="' + cls + '"' +
        (!state.challengeConfirmed ? ' onclick="ChallengeEngine.select(' + i + ')"' : '') +
        '>' +
        '<div class="option-card-label">' + opt.label + '</div>' +
        '<div class="option-card-text">' + opt.text + '</div>' +
      '</div>';
    }

    // Confirm button
    if (state.challengeSelected !== null && state.challengeSelected !== undefined && !state.challengeConfirmed) {
      html += '<div style="text-align:center;margin-top:var(--space-md);">' +
        '<button class="btn btn-secondary" onclick="ChallengeEngine.confirm()">Confirm Choice</button>' +
      '</div>';
    }

    // AI Response panel (after confirming)
    if (state.challengeConfirmed) {
      var selected = CHALLENGE.options[state.challengeSelected];
      html += '<div class="ai-response-panel">' +
        '<div class="ai-response-header">' +
          '<span class="badge ' + selected.badgeClass + '">' + selected.badge + '</span>' +
          '<span>' + selected.responseLabel + '</span>' +
        '</div>' +
        '<div class="ai-response-body">' + selected.response.replace(/\n/g, '<br>') + '</div>' +
      '</div>' +
      '<div class="reflection-text">' + selected.reflection + '</div>';
    }

    container.innerHTML = html;
  }

  window.ChallengeEngine = {
    select: function(idx) {
      if (state.challengeConfirmed) return;
      state.challengeSelected = idx;
      renderChallenge();
    },
    confirm: function() {
      state.challengeConfirmed = true;
      saveProgress();
      renderChallenge();
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // SECTION 7: BUILDER ENGINE (Slide 14)
  // ═══════════════════════════════════════════════════════════════

  function initBuilder() {
    var genBtn = document.getElementById('builder-generate');
    if (!genBtn) return;

    genBtn.addEventListener('click', function() {
      var technique = document.getElementById('builder-technique').value;
      var useCase = document.getElementById('builder-usecase').value;
      var format = document.getElementById('builder-format').value;
      var context = document.getElementById('builder-context').value.trim();

      var template = buildTemplate(technique, useCase, format, context);

      var output = document.getElementById('builder-output');
      if (output) {
        output.className = 'builder-output visible';
        output.innerHTML = '<div style="margin-top:var(--space-lg);">' +
          '<div style="font-size:13px;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;margin-bottom:var(--space-sm);">YOUR GENERATED TEMPLATE</div>' +
          '<div class="prompt-box neutral" id="builder-result">' + escapeHTML(template) + '</div>' +
          '<button class="copy-btn" id="builder-copy" style="margin-top:var(--space-sm);">' + icon('copy', 14, 'currentColor') + ' Copy Template</button>' +
        '</div>';

        var copyBtn = document.getElementById('builder-copy');
        if (copyBtn) {
          copyBtn.addEventListener('click', function() {
            copyToClipboard(template, copyBtn);
          });
        }
      }
    });
  }

  function buildTemplate(technique, useCase, format, context) {
    var useCaseLabels = { meeting: 'client meeting', research: 'research summary', email: 'stakeholder email', workshop: 'workshop design', proposal: 'proposal draft', data: 'data analysis request' };
    var formatLabels = { bullets: 'bullet points', numbered: 'a numbered list', report: 'a structured report', summary: 'an executive summary', table: 'a table format' };

    var uc = useCaseLabels[useCase] || useCase;
    var fmt = formatLabels[format] || format;
    var ctx = context ? '\nContext: ' + context : '\nContext: [describe your specific situation, background, and constraints in 2-3 sentences]';

    if (technique === 'rctf') {
      return 'You are a [your role/title] preparing a ' + uc + '.' + ctx + '\nTask: [describe specifically what you need the AI to produce].\nFormat: Present the output as ' + fmt + '. Professional tone, no preamble.';
    } else if (technique === 'braindump') {
      return '[Write everything you know about this ' + uc + ' \u2014 the background, who\'s involved, what you\'ve tried, what you\'re unsure about, any constraints.]' + (context ? '\n\nHere\'s what I know so far: ' + context : '') + '\n\nWhat have I missed? What patterns do you see? What would you suggest? Present your response as ' + fmt + '.';
    } else if (technique === 'cot') {
      return 'I need help with a ' + uc + '.' + ctx + '\n\nBefore giving your answer, think step by step through:\n1. What are the key considerations?\n2. What are the risks or assumptions?\n3. What alternatives should be considered?\n\nThen give me your recommendation as ' + fmt + '.';
    } else if (technique === 'fewshot') {
      return 'Here are [2-3] examples of previous ' + uc + ' outputs:\n\nExample 1: [paste example]\nExample 2: [paste example]' + ctx + '\n\nUsing the same tone, style, and structure, create a new ' + uc + ' for my situation. Present as ' + fmt + '.';
    } else if (technique === 'iterative') {
      return '[Paste your previous draft or the AI\'s output for this ' + uc + ']' + ctx + '\n\nReview this and make the following changes:\n- [Change 1]\n- [Change 2]\n- [Change 3]\n\nKeep everything else the same. Present the final version as ' + fmt + '.';
    }
    return '';
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 8: SCORM INTEGRATION
  // ═══════════════════════════════════════════════════════════════

  function saveProgress() {
    ScormAPI.setBookmark(String(state.currentSlide));
    ScormAPI.setSuspendData(serializeState());
    ScormAPI.commit();
  }

  function completeModule() {
    if (!window.QuizEngine || !window.QuizEngine.isComplete()) {
      ScormAPI.setLessonStatus('browsed');
    } else {
      var score = window.QuizEngine.getScore();
      var pct = Math.round((score.correct / score.total) * 100);
      ScormAPI.setScore(pct, 0, 100);
      ScormAPI.setLessonStatus(pct >= 60 ? 'passed' : 'completed');
    }
    ScormAPI.commit();
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 9: NAVIGATION
  // ═══════════════════════════════════════════════════════════════

  window.CourseNav = {
    next: function() {
      if (!canAdvance()) return;
      if (state.currentSlide >= TOTAL_SLIDES - 1) {
        completeModule();
        return;
      }
      // Save quiz state before leaving quiz slide
      if (state.currentSlide === 10 && window.QuizEngine) {
        state.quizState = window.QuizEngine.getState();
        state.confidenceOpen = window.QuizEngine.getConfidenceOpen();
      }
      state.currentSlide++;
      renderSlide();
      saveProgress();
    },
    prev: function() {
      if (state.currentSlide <= 0) return;
      if (state.currentSlide === 10 && window.QuizEngine) {
        state.quizState = window.QuizEngine.getState();
      }
      state.currentSlide--;
      renderSlide();
      saveProgress();
    },
    goTo: function(idx) {
      if (idx < 0 || idx >= TOTAL_SLIDES) return;
      state.currentSlide = idx;
      renderSlide();
      saveProgress();
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // SECTION 10: EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════

  function handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.target.closest('.drag-chip') || e.target.closest('.drop-zone') || e.target.closest('.flip-card') || e.target.closest('.hotspot-overlay')) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      CourseNav.next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      CourseNav.prev();
    }
  }

  function handleClicks(e) {
    // Tab buttons
    var tabBtn = e.target.closest('.tab-btn');
    if (tabBtn) {
      var tabName = tabBtn.getAttribute('data-tab');
      state.activeTab = tabName;
      var allBtns = document.querySelectorAll('.tab-btn');
      for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.toggle('active', allBtns[i].getAttribute('data-tab') === tabName);
      }
      var allPanels = document.querySelectorAll('.tab-panel');
      for (var j = 0; j < allPanels.length; j++) {
        allPanels[j].classList.toggle('active', allPanels[j].getAttribute('data-panel') === tabName);
      }
      return;
    }

    // Copy buttons (template cards)
    var copyBtn = e.target.closest('[data-copy-index]');
    if (copyBtn) {
      var idx = parseInt(copyBtn.getAttribute('data-copy-index'));
      var text = TEMPLATES[idx] ? TEMPLATES[idx].text : '';
      copyToClipboard(text, copyBtn);
      return;
    }
  }

  function copyToClipboard(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        showCopied(btn);
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showCopied(btn);
    }
  }

  function showCopied(btn) {
    var orig = btn.innerHTML;
    btn.innerHTML = icon('check', 14, '#48BB78') + ' Copied';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.innerHTML = orig;
      btn.classList.remove('copied');
    }, 2000);
  }

  function printTemplates() {
    var w = window.open('', '_blank');
    var html = '<!DOCTYPE html><html><head><title>Prompt Starter Kit</title>' +
      '<style>body{font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#1A202C;}' +
      'h1{font-size:24px;margin-bottom:24px;}' +
      '.template{border:1px solid #E2E8F0;border-radius:8px;padding:20px;margin-bottom:20px;}' +
      '.tag{display:inline-block;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;color:#fff;margin-bottom:8px;}' +
      '.use{font-size:12px;color:#718096;margin-bottom:12px;}' +
      'pre{background:#F7FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:16px;font-size:13px;line-height:1.6;white-space:pre-wrap;word-break:break-word;}</style></head><body>' +
      '<h1>Prompt Engineering Starter Kit</h1>' +
      '<p style="color:#718096;margin-bottom:24px;">From the OXYGY AI Upskilling Framework \u2014 Level 1</p>';

    var tagColors = { 'RCTF': '#38B2AC', 'BRAIN DUMP': '#A8F0E0', 'CHAIN OF THOUGHT': '#667EEA', 'FEW-SHOT': '#ED8936', 'ITERATIVE': '#48BB78' };
    var tagTextColors = { 'BRAIN DUMP': '#1A202C' };

    for (var i = 0; i < TEMPLATES.length; i++) {
      var t = TEMPLATES[i];
      html += '<div class="template">' +
        '<div class="tag" style="background:' + (tagColors[t.tag] || '#38B2AC') + ';color:' + (tagTextColors[t.tag] || '#fff') + ';">' + t.tag + '</div>' +
        '<div class="use">' + t.useCase + '</div>' +
        '<pre>' + escapeHTML(t.text) + '</pre></div>';
    }

    html += '</body></html>';
    w.document.write(html);
    w.document.close();
    setTimeout(function() { w.print(); }, 500);
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 11: UTILITIES
  // ═══════════════════════════════════════════════════════════════

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 12: INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  function init() {
    ScormAPI.initialize();

    var suspendData = ScormAPI.getSuspendData();
    if (suspendData) {
      restoreState(suspendData);
    }

    renderSlide();

    document.addEventListener('keydown', handleKeyboard);
    document.addEventListener('click', handleClicks);

    window.addEventListener('beforeunload', function() {
      // Save quiz state if on quiz slide
      if (state.currentSlide === 10 && window.QuizEngine) {
        state.quizState = window.QuizEngine.getState();
        state.confidenceOpen = window.QuizEngine.getConfidenceOpen();
      }
      saveProgress();
      ScormAPI.terminate();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
