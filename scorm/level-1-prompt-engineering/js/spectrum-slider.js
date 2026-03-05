/* =================================================================
   SpectrumSlider — Draggable spectrum slider for SCORM course
   Used by: Slide 03 (No One Right Way)

   API:
     window.SpectrumSlider.init(config)
     window.SpectrumSlider.getPosition(instanceId)
   ================================================================= */

(function() {
  'use strict';

  var instances = {};

  function init(config) {
    /*
      config = {
        instanceId: string,
        trackId: string,          // DOM id of .spectrum-track
        handleId: string,         // DOM id of .spectrum-handle
        panelId: string,          // DOM id of .technique-panel
        positions: [
          { name, when, example, min, max }  // min/max as 0-100 percentages
        ],
        initialPosition: number,  // 0-100, default 100 (right / structured)
        onPositionChange: function(positionIndex, percent)
      }
    */
    var inst = {
      config: config,
      currentPercent: config.initialPosition !== undefined ? config.initialPosition : 100,
      isDragging: false
    };
    instances[config.instanceId] = inst;

    var track = document.getElementById(config.trackId);
    var handle = document.getElementById(config.handleId);
    if (!track || !handle) return;

    // Set initial position
    setHandlePosition(inst, track, handle, inst.currentPercent);
    updatePanel(inst);

    // ─── Mouse events ───

    handle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      inst.isDragging = true;
      handle.style.cursor = 'grabbing';

      function onMouseMove(ev) {
        if (!inst.isDragging) return;
        var rect = track.getBoundingClientRect();
        var pct = ((ev.clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        inst.currentPercent = pct;
        setHandlePosition(inst, track, handle, pct);
        updatePanel(inst);
      }

      function onMouseUp() {
        inst.isDragging = false;
        handle.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // Snap to nearest third
        snapToNearest(inst, track, handle);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    // Click on track to jump
    track.addEventListener('click', function(e) {
      if (e.target === handle) return;
      var rect = track.getBoundingClientRect();
      var pct = ((e.clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      inst.currentPercent = pct;
      snapToNearest(inst, track, handle);
    });

    // ─── Touch events ───

    handle.addEventListener('touchstart', function(e) {
      e.preventDefault();
      inst.isDragging = true;
    }, { passive: false });

    handle.addEventListener('touchmove', function(e) {
      if (!inst.isDragging) return;
      e.preventDefault();
      var touch = e.touches[0];
      var rect = track.getBoundingClientRect();
      var pct = ((touch.clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      inst.currentPercent = pct;
      setHandlePosition(inst, track, handle, pct);
      updatePanel(inst);
    }, { passive: false });

    handle.addEventListener('touchend', function() {
      inst.isDragging = false;
      snapToNearest(inst, track, handle);
    });

    // ─── Keyboard ───

    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    handle.setAttribute('aria-valuenow', String(Math.round(inst.currentPercent)));

    handle.addEventListener('keydown', function(e) {
      var step = 10;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        inst.currentPercent = Math.min(100, inst.currentPercent + step);
        setHandlePosition(inst, track, handle, inst.currentPercent);
        updatePanel(inst);
        handle.setAttribute('aria-valuenow', String(Math.round(inst.currentPercent)));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        inst.currentPercent = Math.max(0, inst.currentPercent - step);
        setHandlePosition(inst, track, handle, inst.currentPercent);
        updatePanel(inst);
        handle.setAttribute('aria-valuenow', String(Math.round(inst.currentPercent)));
      } else if (e.key === 'Home') {
        e.preventDefault();
        inst.currentPercent = 0;
        snapToNearest(inst, track, handle);
      } else if (e.key === 'End') {
        e.preventDefault();
        inst.currentPercent = 100;
        snapToNearest(inst, track, handle);
      }
    });
  }

  function setHandlePosition(inst, track, handle, pct) {
    handle.style.left = pct + '%';
  }

  function snapToNearest(inst, track, handle) {
    // Snap points: 0%, 50%, 100%
    var snaps = [0, 50, 100];
    var closest = snaps[0];
    var closestDist = Math.abs(inst.currentPercent - snaps[0]);

    for (var i = 1; i < snaps.length; i++) {
      var dist = Math.abs(inst.currentPercent - snaps[i]);
      if (dist < closestDist) {
        closest = snaps[i];
        closestDist = dist;
      }
    }

    inst.currentPercent = closest;

    // Animate snap
    handle.style.transition = 'left 200ms ease';
    handle.style.left = closest + '%';
    setTimeout(function() {
      handle.style.transition = '';
    }, 200);

    handle.setAttribute('aria-valuenow', String(closest));
    updatePanel(inst);

    if (inst.config.onPositionChange) {
      var posIdx = getPositionIndex(inst);
      inst.config.onPositionChange(posIdx, closest);
    }
  }

  function getPositionIndex(inst) {
    var pct = inst.currentPercent;
    var positions = inst.config.positions;
    for (var i = 0; i < positions.length; i++) {
      if (pct >= positions[i].min && pct <= positions[i].max) {
        return i;
      }
    }
    return 0;
  }

  function updatePanel(inst) {
    var panel = document.getElementById(inst.config.panelId);
    if (!panel) return;

    var idx = getPositionIndex(inst);
    var pos = inst.config.positions[idx];
    if (!pos) return;

    // Fade transition
    panel.style.opacity = '0';
    setTimeout(function() {
      var nameEl = panel.querySelector('.technique-panel-name');
      var whenEl = panel.querySelector('.technique-panel-when');
      var exampleEl = panel.querySelector('.technique-panel-example');

      if (nameEl) nameEl.textContent = pos.name;
      if (whenEl) whenEl.textContent = pos.when;
      if (exampleEl) exampleEl.textContent = pos.example;

      panel.style.opacity = '1';
    }, 150);
  }

  function getPosition(instanceId) {
    var inst = instances[instanceId];
    if (!inst) return null;
    return {
      percent: inst.currentPercent,
      positionIndex: getPositionIndex(inst)
    };
  }

  window.SpectrumSlider = {
    init: init,
    getPosition: getPosition
  };

})();
