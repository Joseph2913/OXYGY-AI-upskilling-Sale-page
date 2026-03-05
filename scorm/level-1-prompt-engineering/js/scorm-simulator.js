/* =================================================================
   SCORM 1.2 Simulator — Local Testing Only
   Mocks the SCORM API and provides a debug panel
   ================================================================= */

(function() {
  'use strict';

  var STORAGE_KEY = 'oxygy_scorm_sim_l1';
  var apiCalls = [];
  var debugPanel = null;
  var debugVisible = false;

  // ─── CMI DATA MODEL ───
  var cmi = loadState() || {
    'cmi.core.student_id':      'test-student-001',
    'cmi.core.student_name':    'Test, Student',
    'cmi.core.lesson_location': '',
    'cmi.core.lesson_status':   'not attempted',
    'cmi.core.credit':          'credit',
    'cmi.core.entry':           'ab-initio',
    'cmi.core.score.raw':       '',
    'cmi.core.score.min':       '0',
    'cmi.core.score.max':       '100',
    'cmi.core.exit':            '',
    'cmi.core.session_time':    '0000:00:00',
    'cmi.core.total_time':      '0000:00:00',
    'cmi.core.lesson_mode':     'normal',
    'cmi.suspend_data':         ''
  };

  // Determine entry type
  if (cmi['cmi.core.lesson_status'] !== 'not attempted' && cmi['cmi.suspend_data']) {
    cmi['cmi.core.entry'] = 'resume';
  }

  // Read-only keys
  var readOnly = [
    'cmi.core.student_id', 'cmi.core.student_name', 'cmi.core.credit',
    'cmi.core.entry', 'cmi.core.total_time', 'cmi.core.lesson_mode'
  ];

  // Write-only keys
  var writeOnly = ['cmi.core.exit', 'cmi.core.session_time'];

  var lastError = '0';

  function loadState() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cmi));
    } catch (e) {
      console.warn('[SCORM Sim] Could not save to localStorage');
    }
  }

  function logCall(method, args, result) {
    var entry = {
      time: new Date().toLocaleTimeString(),
      method: method,
      args: args || '',
      result: result || ''
    };
    apiCalls.push(entry);
    if (apiCalls.length > 20) apiCalls.shift();
    updateDebugPanel();
  }

  // ─── MOCK API OBJECT ───
  window.API = {
    LMSInitialize: function(param) {
      lastError = '0';
      logCall('LMSInitialize', param, 'true');
      return 'true';
    },

    LMSFinish: function(param) {
      lastError = '0';
      saveState();
      logCall('LMSFinish', param, 'true');
      return 'true';
    },

    LMSGetValue: function(key) {
      lastError = '0';
      if (writeOnly.indexOf(key) !== -1) {
        lastError = '404';
        logCall('LMSGetValue', key, 'ERROR: write-only');
        return '';
      }
      var val = cmi[key] !== undefined ? cmi[key] : '';
      logCall('LMSGetValue', key, val);
      return val;
    },

    LMSSetValue: function(key, value) {
      lastError = '0';
      if (readOnly.indexOf(key) !== -1) {
        lastError = '403';
        logCall('LMSSetValue', key + ' = ' + value, 'ERROR: read-only');
        return 'false';
      }
      cmi[key] = value;
      logCall('LMSSetValue', key + ' = ' + value, 'true');
      updateDebugPanel();
      return 'true';
    },

    LMSCommit: function(param) {
      lastError = '0';
      saveState();
      logCall('LMSCommit', param, 'true');
      return 'true';
    },

    LMSGetLastError: function() {
      return lastError;
    },

    LMSGetErrorString: function(code) {
      var errors = {
        '0': 'No Error',
        '101': 'General Exception',
        '201': 'Invalid Argument Error',
        '301': 'Not Initialized',
        '401': 'Not Implemented Error',
        '403': 'Element is read only',
        '404': 'Element is write only'
      };
      return errors[code] || 'Unknown Error';
    },

    LMSGetDiagnostic: function(code) {
      return 'Simulator diagnostic for error ' + code;
    }
  };

  // ─── DEBUG PANEL ───
  function createDebugPanel() {
    // Toggle button
    var btn = document.createElement('button');
    btn.id = 'scorm-debug-toggle';
    btn.textContent = 'SCORM Debug';
    btn.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:10000;' +
      'background:#2D3748;color:#A0AEC0;border:1px solid #4A5568;border-radius:4px;' +
      'padding:4px 10px;font-family:monospace;font-size:11px;cursor:pointer;' +
      'opacity:0.7;transition:opacity 150ms;';
    btn.onmouseover = function() { btn.style.opacity = '1'; };
    btn.onmouseout = function()  { btn.style.opacity = '0.7'; };
    btn.onclick = function() {
      debugVisible = !debugVisible;
      debugPanel.style.display = debugVisible ? 'block' : 'none';
    };

    // Panel
    debugPanel = document.createElement('div');
    debugPanel.id = 'scorm-debug-panel';
    debugPanel.style.cssText = 'position:fixed;bottom:40px;right:12px;z-index:10000;' +
      'width:380px;max-height:260px;overflow-y:auto;background:#1A202C;color:#A8F0E0;' +
      'border:1px solid #4A5568;border-radius:6px;padding:12px;' +
      'font-family:monospace;font-size:11px;line-height:1.5;display:none;';

    document.body.appendChild(debugPanel);
    document.body.appendChild(btn);
  }

  function updateDebugPanel() {
    if (!debugPanel) return;
    var html = '<div style="color:#38B2AC;font-weight:bold;margin-bottom:8px;">SCORM 1.2 Simulator</div>';

    // Key values
    html += '<div style="margin-bottom:8px;border-bottom:1px solid #4A5568;padding-bottom:8px;">';
    html += '<div>Slide: <span style="color:#FBE8A6;">' + (cmi['cmi.core.lesson_location'] || '—') + '</span></div>';
    html += '<div>Status: <span style="color:#FBE8A6;">' + cmi['cmi.core.lesson_status'] + '</span></div>';
    html += '<div>Score: <span style="color:#FBE8A6;">' + (cmi['cmi.core.score.raw'] || '—') + '</span></div>';
    html += '<div>Entry: <span style="color:#FBE8A6;">' + cmi['cmi.core.entry'] + '</span></div>';
    html += '</div>';

    // Recent API calls
    html += '<div style="color:#718096;font-size:10px;margin-bottom:4px;">RECENT API CALLS</div>';
    var recent = apiCalls.slice(-10);
    for (var i = recent.length - 1; i >= 0; i--) {
      var c = recent[i];
      html += '<div style="color:#A0AEC0;font-size:10px;">';
      html += '<span style="color:#718096;">' + c.time + '</span> ';
      html += c.method + '(' + c.args + ')';
      if (c.result) html += ' → <span style="color:#A8F0E0;">' + c.result + '</span>';
      html += '</div>';
    }

    debugPanel.innerHTML = html;
  }

  // ─── INIT ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDebugPanel);
  } else {
    createDebugPanel();
  }

  // Expose reset for testing
  window.ScormSimReset = function() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  };
})();
