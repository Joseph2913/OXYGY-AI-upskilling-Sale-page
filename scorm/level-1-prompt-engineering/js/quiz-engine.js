/* =================================================================
   QuizEngine — Three-format quiz for SCORM course
   Used by: Slide 11

   Handles 3 question types:
     Q1: Drag-sort into buckets (uses DragDropEngine)
     Q2: Hotspot click on a chat mockup
     Q3: Confidence slider + MCQ

   API:
     window.QuizEngine.init(containerId)
     window.QuizEngine.renderQuestion(n)
     window.QuizEngine.checkAnswer()
     window.QuizEngine.nextQuestion()
     window.QuizEngine.isComplete()
     window.QuizEngine.getScore()
     window.QuizEngine.getConfidenceOpen()
     window.QuizEngine.getState()
     window.QuizEngine.restoreState(state)
   ================================================================= */

(function() {
  'use strict';

  var containerId = null;
  var currentQuestion = 1;

  var questionState = {
    q1: { completed: false, correct: null, answer: null, score: 0, total: 5 },
    q2: { completed: false, correct: null, answer: null },
    q3: { completed: false, correct: null, answer: null, confidence: 5 }
  };

  // ─── Q1 Data: Drag-sort ───
  var Q1_CHIPS = [
    { id: 'q1-c1', text: 'Say everything you know about the problem before asking', correctZone: 'braindump' },
    { id: 'q1-c2', text: 'Assign the AI a specific professional role', correctZone: 'rctf' },
    { id: 'q1-c3', text: 'Ask the AI to think step by step before concluding', correctZone: 'other' },
    { id: 'q1-c4', text: 'Give 2\u20133 examples of the output you want first', correctZone: 'other' },
    { id: 'q1-c5', text: 'Specify exactly how to format the response', correctZone: 'rctf' }
  ];

  var Q1_ZONES = [
    { id: 'braindump', label: 'Brain Dump' },
    { id: 'rctf', label: 'RCTF Framework' },
    { id: 'other', label: 'Other Technique' }
  ];

  // ─── Q2 Data: Hotspot ───
  var Q2_MESSAGES = [
    { sender: 'user', text: 'Help me write something for the client.', hotspot: 'A' },
    { sender: 'ai', text: "I'd be happy to help! Could you tell me more about what you need to write and who the client is?" },
    { sender: 'user', text: "It's a proposal. The usual format.", hotspot: 'B' },
    { sender: 'ai', text: 'Here is a standard proposal structure: Executive Summary, Background, Proposed Solution...' },
    { sender: 'user', text: 'Make it shorter.', hotspot: 'C' },
    { sender: 'ai', text: 'Here is a condensed version...' },
    { sender: 'user', text: 'Thanks, this works.', hotspot: 'D' }
  ];

  var Q2_CORRECT = 'B';
  var Q2_EXPLANATION = "This is where the conversation went wrong. 'The usual format' means nothing to the AI \u2014 it has no access to your team's conventions. Specifying client name, industry, proposal type, length, and tone here would have transformed the output.";

  // ─── Q3 Data: MCQ ───
  var Q3_OPTIONS = [
    { letter: 'A', text: 'Making it longer and more detailed', correct: false },
    { letter: 'B', text: 'Adding a clear Role, specific Context, and defined Format', correct: true },
    { letter: 'C', text: 'Using more formal language', correct: false },
    { letter: 'D', text: 'Breaking it into multiple separate messages', correct: false }
  ];

  var Q3_EXPLANATION_CORRECT = "Length doesn\u2019t make a prompt better \u2014 specificity does. Role, Context, and Format are the three elements most often missing from prompts that produce disappointing results.";
  var Q3_EXPLANATION_WRONG = "Length doesn\u2019t make a prompt better \u2014 specificity does. The correct answer is B: adding a clear Role, specific Context, and defined Format.";

  // ─── Init ───

  function init(id) {
    containerId = id;
    currentQuestion = 1;

    // Start at first unanswered question
    if (questionState.q1.completed) currentQuestion = 2;
    if (questionState.q1.completed && questionState.q2.completed) currentQuestion = 3;

    renderQuestion(currentQuestion);
  }

  // ─── Render ───

  function renderQuestion(n) {
    currentQuestion = n;
    var container = document.getElementById(containerId);
    if (!container) return;

    var html = '<div class="quiz-progress">Question ' + n + ' of 3</div>';

    if (n === 1) html += renderQ1();
    else if (n === 2) html += renderQ2();
    else if (n === 3) html += renderQ3();

    container.innerHTML = html;

    // Post-render hooks
    if (n === 1) initQ1();
    if (n === 2) initQ2();
    if (n === 3) initQ3();
  }

  // ═══════════════════════════════════════════
  // Q1: Drag-sort
  // ═══════════════════════════════════════════

  function renderQ1() {
    var html = '<div class="quiz-question">Sort these prompting approaches into the correct categories. Drag each card to where it belongs.</div>';

    html += '<div id="q1-dd-container">';

    // Chip source
    html += '<div class="chips-source">';
    for (var i = 0; i < Q1_CHIPS.length; i++) {
      html += '<div class="drag-chip" data-chip-id="' + Q1_CHIPS[i].id + '">' + Q1_CHIPS[i].text + '</div>';
    }
    html += '</div>';

    // Drop zones (3 buckets in a row)
    html += '<div class="drop-zones-row">';
    for (var j = 0; j < Q1_ZONES.length; j++) {
      var z = Q1_ZONES[j];
      html += '<div class="drop-zone" data-zone="' + z.id + '">' +
        '<div class="drop-zone-header"><span class="drop-zone-pill">' + z.label + '</span></div>' +
        '<div class="drop-zone-placeholder">Drop here</div>' +
        '</div>';
    }
    html += '</div>';

    html += '</div>';

    // Check answer button (disabled until all placed)
    html += '<button class="btn btn-primary" id="q1-check-btn" disabled>Check Answer</button>';

    // Feedback area
    html += '<div id="q1-feedback"></div>';

    return html;
  }

  function initQ1() {
    if (questionState.q1.completed) {
      // Re-render as completed
      showQ1Results();
      return;
    }

    window.DragDropEngine.init({
      instanceId: 'quiz-q1',
      containerId: 'q1-dd-container',
      chips: Q1_CHIPS,
      zones: Q1_ZONES,
      multiplePerZone: true,
      onAllPlaced: function() {
        var btn = document.getElementById('q1-check-btn');
        if (btn) btn.disabled = false;
      }
    });

    var checkBtn = document.getElementById('q1-check-btn');
    if (checkBtn) {
      checkBtn.addEventListener('click', function() {
        checkQ1();
      });
    }
  }

  function checkQ1() {
    var results = window.DragDropEngine.checkAnswers('quiz-q1');
    if (!results) return;

    questionState.q1.completed = true;
    questionState.q1.score = results.correct;
    questionState.q1.correct = results.correct === results.total;
    questionState.q1.answer = results.details;

    var fb = document.getElementById('q1-feedback');
    if (fb) {
      var msg = results.correct === results.total ?
        'Perfect \u2014 you sorted all 5 correctly!' :
        'You got ' + results.correct + '/5 correct. Review the highlighted chips to see the correct categories.';

      fb.innerHTML = '<div class="quiz-feedback ' +
        (results.correct === results.total ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect') +
        '" style="margin-top:16px;">' +
        '<strong>' + (results.correct === results.total ? 'Excellent!' : 'Good effort!') + '</strong> ' + msg +
        '</div>';
    }

    // Replace check button with next
    var checkBtn = document.getElementById('q1-check-btn');
    if (checkBtn) {
      checkBtn.textContent = 'Next Question \u2192';
      checkBtn.disabled = false;
      checkBtn.onclick = function() { renderQuestion(2); };
    }
  }

  function showQ1Results() {
    var container = document.getElementById(containerId);
    if (!container) return;

    var html = '<div class="quiz-progress">Question 1 of 3</div>';
    html += '<div class="quiz-question">Sort these prompting approaches into the correct categories.</div>';
    html += '<div class="quiz-feedback quiz-feedback--correct" style="margin-bottom:16px;">';
    html += '<strong>Completed!</strong> You got ' + questionState.q1.score + '/5 correct.';
    html += '</div>';
    html += '<button class="btn btn-primary" onclick="QuizEngine.nextQuestion()">Next Question \u2192</button>';
    container.innerHTML = html;
  }

  // ═══════════════════════════════════════════
  // Q2: Hotspot
  // ═══════════════════════════════════════════

  function renderQ2() {
    var html = '<div class="quiz-question">Look at this AI conversation. Click the moment where the user\'s prompt is weakest \u2014 where adding more information would have made the biggest difference.</div>';

    // Chat mockup
    html += '<div class="chat-mockup" id="q2-chat">';
    for (var i = 0; i < Q2_MESSAGES.length; i++) {
      var m = Q2_MESSAGES[i];
      var msgClass = m.sender === 'user' ? 'user-msg' : 'ai-msg';
      html += '<div class="chat-message ' + msgClass + '">';
      html += '<div class="chat-sender ' + m.sender + '">' + (m.sender === 'user' ? 'USER' : 'AI') + '</div>';
      html += '<div>' + m.text + '</div>';
      if (m.hotspot) {
        html += '<div class="hotspot-overlay" data-hotspot="' + m.hotspot + '" tabindex="0" role="button" aria-label="Select hotspot ' + m.hotspot + '">';
        html += '<span class="hotspot-label">' + m.hotspot + '</span>';
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';

    // Check button
    html += '<button class="btn btn-primary" id="q2-check-btn" disabled>Check Answer</button>';

    // Feedback
    html += '<div id="q2-feedback"></div>';

    return html;
  }

  var q2Selected = null;

  function initQ2() {
    if (questionState.q2.completed) {
      showQ2Results();
      return;
    }

    q2Selected = null;
    var hotspots = document.querySelectorAll('#q2-chat .hotspot-overlay');

    for (var i = 0; i < hotspots.length; i++) {
      (function(hs) {
        hs.addEventListener('click', function() {
          if (questionState.q2.completed) return;
          selectHotspot(hs.getAttribute('data-hotspot'));
        });
        hs.addEventListener('keydown', function(e) {
          if (questionState.q2.completed) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectHotspot(hs.getAttribute('data-hotspot'));
          }
        });
      })(hotspots[i]);
    }

    var checkBtn = document.getElementById('q2-check-btn');
    if (checkBtn) {
      checkBtn.addEventListener('click', function() {
        checkQ2();
      });
    }
  }

  function selectHotspot(label) {
    q2Selected = label;

    // Clear all selections
    var hotspots = document.querySelectorAll('#q2-chat .hotspot-overlay');
    for (var i = 0; i < hotspots.length; i++) {
      hotspots[i].classList.remove('selected');
    }

    // Highlight selected
    var sel = document.querySelector('.hotspot-overlay[data-hotspot="' + label + '"]');
    if (sel) sel.classList.add('selected');

    // Enable check button
    var btn = document.getElementById('q2-check-btn');
    if (btn) btn.disabled = false;
  }

  function checkQ2() {
    var isCorrect = q2Selected === Q2_CORRECT;
    questionState.q2.completed = true;
    questionState.q2.correct = isCorrect;
    questionState.q2.answer = q2Selected;

    // Mark hotspots
    var hotspots = document.querySelectorAll('#q2-chat .hotspot-overlay');
    for (var i = 0; i < hotspots.length; i++) {
      var label = hotspots[i].getAttribute('data-hotspot');
      hotspots[i].classList.remove('selected');
      if (label === Q2_CORRECT) {
        hotspots[i].classList.add('correct');
      } else if (label === q2Selected) {
        hotspots[i].classList.add('incorrect');
      }
      hotspots[i].style.pointerEvents = 'none';
    }

    var fb = document.getElementById('q2-feedback');
    if (fb) {
      fb.innerHTML = '<div class="quiz-feedback ' +
        (isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect') +
        '" style="margin-top:16px;">' +
        '<strong>' + (isCorrect ? 'Correct!' : 'Not quite \u2014 the answer is B.') + '</strong> ' +
        Q2_EXPLANATION +
        '</div>';
    }

    // Replace check button
    var checkBtn = document.getElementById('q2-check-btn');
    if (checkBtn) {
      checkBtn.textContent = 'Next Question \u2192';
      checkBtn.disabled = false;
      checkBtn.onclick = function() { renderQuestion(3); };
    }
  }

  function showQ2Results() {
    var container = document.getElementById(containerId);
    if (!container) return;

    var html = '<div class="quiz-progress">Question 2 of 3</div>';
    html += '<div class="quiz-question">Click the moment where the user\'s prompt is weakest.</div>';
    html += '<div class="quiz-feedback ' + (questionState.q2.correct ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect') + '" style="margin-bottom:16px;">';
    html += '<strong>' + (questionState.q2.correct ? 'Correct!' : 'The answer was B.') + '</strong> ' + Q2_EXPLANATION;
    html += '</div>';
    html += '<button class="btn btn-primary" onclick="QuizEngine.nextQuestion()">Next Question \u2192</button>';
    container.innerHTML = html;
  }

  // ═══════════════════════════════════════════
  // Q3: Confidence slider + MCQ
  // ═══════════════════════════════════════════

  function renderQ3() {
    var confidence = questionState.q3.confidence || 5;
    var fillPct = ((confidence - 1) / 9) * 100;

    var html = '<div class="quiz-question">Before answering \u2014 how confident are you right now in your ability to write a strong, structured prompt for a real work task?</div>';

    // Confidence slider
    html += '<div class="confidence-slider-wrap" id="q3-confidence-wrap">';
    html += '<div class="confidence-scale"><span>Not confident at all</span><span>Somewhat confident</span><span>Very confident</span></div>';
    html += '<input type="range" class="confidence-input" id="q3-confidence" min="1" max="10" value="' + confidence + '" style="--fill-percent: ' + fillPct + '%">';
    html += '<div class="confidence-value-display" id="q3-confidence-value">' + confidence + '</div>';
    html += '<div class="confidence-label-display" id="q3-confidence-label">' + getConfidenceLabel(confidence) + '</div>';
    html += '</div>';

    // Divider
    html += '<div style="height:1px;background:var(--color-border);margin:var(--space-lg) 0;"></div>';

    // MCQ question
    html += '<div class="quiz-question" style="font-size:16px;">Which of the following would most improve a weak prompt?</div>';

    for (var i = 0; i < Q3_OPTIONS.length; i++) {
      var opt = Q3_OPTIONS[i];
      html += '<button class="quiz-option" data-q3-option="' + i + '">' +
        '<span class="quiz-option-letter">' + opt.letter + '</span>' +
        '<span>' + opt.text + '</span>' +
        '</button>';
    }

    html += '<div id="q3-actions"></div>';
    html += '<div id="q3-feedback"></div>';

    return html;
  }

  var q3SelectedOption = null;

  function initQ3() {
    if (questionState.q3.completed) {
      showQ3Results();
      return;
    }

    q3SelectedOption = null;

    // Confidence slider
    var slider = document.getElementById('q3-confidence');
    if (slider) {
      slider.addEventListener('input', function() {
        var val = parseInt(slider.value);
        questionState.q3.confidence = val;
        var fillPct = ((val - 1) / 9) * 100;
        slider.style.setProperty('--fill-percent', fillPct + '%');

        var display = document.getElementById('q3-confidence-value');
        if (display) display.textContent = val;

        var label = document.getElementById('q3-confidence-label');
        if (label) label.textContent = getConfidenceLabel(val);
      });
    }

    // MCQ options
    var options = document.querySelectorAll('[data-q3-option]');
    for (var i = 0; i < options.length; i++) {
      (function(opt) {
        opt.addEventListener('click', function() {
          if (questionState.q3.completed) return;
          q3SelectedOption = parseInt(opt.getAttribute('data-q3-option'));

          // Clear selected
          var allOpts = document.querySelectorAll('[data-q3-option]');
          for (var j = 0; j < allOpts.length; j++) {
            allOpts[j].classList.remove('selected');
          }
          opt.classList.add('selected');

          // Show check button
          var actions = document.getElementById('q3-actions');
          if (actions && !actions.querySelector('.btn')) {
            actions.innerHTML = '<button class="btn btn-primary" id="q3-check-btn" style="margin-top:16px;">Check Answer</button>';
            document.getElementById('q3-check-btn').addEventListener('click', function() { checkQ3(); });
          }
        });
      })(options[i]);
    }
  }

  function checkQ3() {
    var isCorrect = Q3_OPTIONS[q3SelectedOption] && Q3_OPTIONS[q3SelectedOption].correct;

    questionState.q3.completed = true;
    questionState.q3.correct = isCorrect;
    questionState.q3.answer = q3SelectedOption;

    // Disable slider
    var slider = document.getElementById('q3-confidence');
    if (slider) slider.disabled = true;

    // Mark options
    var options = document.querySelectorAll('[data-q3-option]');
    for (var i = 0; i < options.length; i++) {
      var idx = parseInt(options[i].getAttribute('data-q3-option'));
      options[i].classList.remove('selected');
      if (idx === q3SelectedOption && isCorrect) options[i].classList.add('correct');
      else if (idx === q3SelectedOption && !isCorrect) options[i].classList.add('incorrect');
      else if (Q3_OPTIONS[idx] && Q3_OPTIONS[idx].correct) options[i].classList.add('correct');
      else options[i].classList.add('disabled');
      options[i].style.pointerEvents = 'none';
    }

    var fb = document.getElementById('q3-feedback');
    if (fb) {
      fb.innerHTML = '<div class="quiz-feedback ' +
        (isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect') +
        '" style="margin-top:16px;">' +
        '<strong>' + (isCorrect ? 'Correct!' : 'Not quite.') + '</strong> ' +
        (isCorrect ? Q3_EXPLANATION_CORRECT : Q3_EXPLANATION_WRONG) +
        '</div>' +
        '<div style="margin-top:12px;font-size:13px;color:var(--color-text-light);font-style:italic;">Your confidence rating has been saved. We\'ll show you how it\'s changed by the end of the module.</div>';
    }

    // Replace actions
    var actions = document.getElementById('q3-actions');
    if (actions) {
      actions.innerHTML = '';
    }
  }

  function showQ3Results() {
    var container = document.getElementById(containerId);
    if (!container) return;

    var html = '<div class="quiz-progress">Question 3 of 3</div>';
    html += '<div class="quiz-question">Which of the following would most improve a weak prompt?</div>';
    html += '<div class="quiz-feedback ' + (questionState.q3.correct ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect') + '" style="margin-bottom:16px;">';
    html += '<strong>' + (questionState.q3.correct ? 'Correct!' : 'The answer was B.') + '</strong> ' +
      (questionState.q3.correct ? Q3_EXPLANATION_CORRECT : Q3_EXPLANATION_WRONG);
    html += '</div>';
    html += '<div style="font-size:13px;color:var(--color-text-light);font-style:italic;">Your confidence rating: ' + questionState.q3.confidence + '/10</div>';
    container.innerHTML = html;
  }

  // ─── Helpers ───

  function getConfidenceLabel(val) {
    if (val <= 3) return 'Not confident yet';
    if (val <= 5) return 'Somewhat confident';
    if (val <= 7) return 'Fairly confident';
    return 'Very confident';
  }

  // ─── Public API ───

  function nextQuestion() {
    if (currentQuestion < 3) {
      renderQuestion(currentQuestion + 1);
    }
  }

  function isComplete() {
    return questionState.q1.completed && questionState.q2.completed && questionState.q3.completed;
  }

  function getScore() {
    var correct = 0;
    var total = 3;
    // Q1: correct if all 5 matched
    if (questionState.q1.correct) correct++;
    if (questionState.q2.correct) correct++;
    if (questionState.q3.correct) correct++;
    return { correct: correct, total: total };
  }

  function getConfidenceOpen() {
    return questionState.q3.confidence;
  }

  function getState() {
    return {
      q1: { completed: questionState.q1.completed, correct: questionState.q1.correct, score: questionState.q1.score },
      q2: { completed: questionState.q2.completed, correct: questionState.q2.correct, answer: questionState.q2.answer },
      q3: { completed: questionState.q3.completed, correct: questionState.q3.correct, answer: questionState.q3.answer, confidence: questionState.q3.confidence }
    };
  }

  function restoreState(s) {
    if (!s) return;
    if (s.q1) {
      questionState.q1.completed = s.q1.completed || false;
      questionState.q1.correct = s.q1.correct || null;
      questionState.q1.score = s.q1.score || 0;
    }
    if (s.q2) {
      questionState.q2.completed = s.q2.completed || false;
      questionState.q2.correct = s.q2.correct || null;
      questionState.q2.answer = s.q2.answer || null;
    }
    if (s.q3) {
      questionState.q3.completed = s.q3.completed || false;
      questionState.q3.correct = s.q3.correct || null;
      questionState.q3.answer = s.q3.answer || null;
      questionState.q3.confidence = s.q3.confidence || 5;
    }
  }

  window.QuizEngine = {
    init: init,
    renderQuestion: renderQuestion,
    checkAnswer: function() {
      if (currentQuestion === 1) checkQ1();
      else if (currentQuestion === 2) checkQ2();
      else if (currentQuestion === 3) checkQ3();
    },
    nextQuestion: nextQuestion,
    isComplete: isComplete,
    getScore: getScore,
    getConfidenceOpen: getConfidenceOpen,
    getState: getState,
    restoreState: restoreState
  };

})();
