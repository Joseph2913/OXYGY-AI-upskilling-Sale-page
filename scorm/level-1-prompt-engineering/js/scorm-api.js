/* =================================================================
   SCORM 1.2 API Wrapper
   Handles LMS communication with graceful degradation
   ================================================================= */

(function() {
  'use strict';

  var api = null;
  var connected = false;
  var startTime = null;

  // ─── API DISCOVERY ───
  function findAPI(win) {
    var attempts = 0;
    while (win && !win.API && attempts < 7) {
      if (win.parent && win.parent !== win) {
        win = win.parent;
      } else {
        break;
      }
      attempts++;
    }
    return win && win.API ? win.API : null;
  }

  function discoverAPI() {
    // Check parent chain
    var found = findAPI(window);
    if (found) return found;

    // Check opener chain
    if (window.opener) {
      found = findAPI(window.opener);
      if (found) return found;
    }

    return null;
  }

  // ─── TIME FORMATTING ───
  // SCORM 1.2 CMITimespan: HHHH:MM:SS
  function formatTime(ms) {
    var totalSeconds = Math.floor(ms / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    return padZero(hours, 4) + ':' + padZero(minutes, 2) + ':' + padZero(seconds, 2);
  }

  function padZero(num, len) {
    var s = String(num);
    while (s.length < len) s = '0' + s;
    return s;
  }

  // ─── PUBLIC INTERFACE ───
  window.ScormAPI = {
    initialize: function() {
      api = discoverAPI();
      if (!api) {
        console.warn('[SCORM] API not found. Running in standalone mode.');
        connected = false;
        return false;
      }
      try {
        var result = api.LMSInitialize('');
        connected = (result === 'true' || result === true);
        if (connected) {
          startTime = Date.now();
          // Set initial status if first launch
          var status = this.getLessonStatus();
          if (!status || status === 'not attempted' || status === '') {
            this.setLessonStatus('incomplete');
            this.commit();
          }
        }
        return connected;
      } catch (e) {
        console.error('[SCORM] Initialize error:', e);
        connected = false;
        return false;
      }
    },

    terminate: function() {
      if (!connected || !api) return false;
      try {
        // Record session time
        if (startTime) {
          var elapsed = Date.now() - startTime;
          this.setValue('cmi.core.session_time', formatTime(elapsed));
        }
        this.commit();
        var result = api.LMSFinish('');
        connected = false;
        return (result === 'true' || result === true);
      } catch (e) {
        console.error('[SCORM] Terminate error:', e);
        return false;
      }
    },

    getValue: function(key) {
      if (!connected || !api) return '';
      try {
        var val = api.LMSGetValue(key);
        var err = api.LMSGetLastError();
        if (err && err !== '0') {
          console.warn('[SCORM] GetValue error for', key, ':', err);
        }
        return val || '';
      } catch (e) {
        console.error('[SCORM] GetValue error:', e);
        return '';
      }
    },

    setValue: function(key, value) {
      if (!connected || !api) return false;
      try {
        var result = api.LMSSetValue(key, String(value));
        var err = api.LMSGetLastError();
        if (err && err !== '0') {
          console.warn('[SCORM] SetValue error for', key, ':', err);
        }
        return (result === 'true' || result === true);
      } catch (e) {
        console.error('[SCORM] SetValue error:', e);
        return false;
      }
    },

    commit: function() {
      if (!connected || !api) return false;
      try {
        var result = api.LMSCommit('');
        return (result === 'true' || result === true);
      } catch (e) {
        console.error('[SCORM] Commit error:', e);
        return false;
      }
    },

    // ─── CONVENIENCE METHODS ───
    getLessonStatus: function() {
      return this.getValue('cmi.core.lesson_status');
    },

    setLessonStatus: function(status) {
      return this.setValue('cmi.core.lesson_status', status);
    },

    getScore: function() {
      return {
        raw: this.getValue('cmi.core.score.raw'),
        min: this.getValue('cmi.core.score.min'),
        max: this.getValue('cmi.core.score.max')
      };
    },

    setScore: function(raw, min, max) {
      this.setValue('cmi.core.score.raw', String(raw));
      this.setValue('cmi.core.score.min', String(min || 0));
      this.setValue('cmi.core.score.max', String(max || 100));
    },

    getBookmark: function() {
      return this.getValue('cmi.core.lesson_location');
    },

    setBookmark: function(location) {
      return this.setValue('cmi.core.lesson_location', String(location));
    },

    getSuspendData: function() {
      return this.getValue('cmi.suspend_data');
    },

    setSuspendData: function(data) {
      var str = typeof data === 'string' ? data : JSON.stringify(data);
      return this.setValue('cmi.suspend_data', str);
    },

    isConnected: function() {
      return connected;
    },

    getLastError: function() {
      if (!api) return '0';
      try {
        return api.LMSGetLastError();
      } catch (e) {
        return '0';
      }
    }
  };
})();
