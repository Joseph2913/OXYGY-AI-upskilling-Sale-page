/* =================================================================
   DragDropEngine — Reusable drag-and-drop for SCORM course
   Used by: Slide 06 (RCTF deconstruction), Slide 11 Q1 (sorting)

   API:
     window.DragDropEngine.init(config)
     window.DragDropEngine.checkAnswers(instanceId)
     window.DragDropEngine.reset(instanceId)
     window.DragDropEngine.getResults(instanceId)
   ================================================================= */

(function() {
  'use strict';

  var instances = {};

  // ─── Helpers ───

  function findZoneUnderPoint(x, y, zones) {
    for (var i = 0; i < zones.length; i++) {
      var rect = zones[i].getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return zones[i];
      }
    }
    return null;
  }

  // ─── Init ───

  function init(config) {
    /*
      config = {
        instanceId: string,
        containerId: string,           // DOM id of the container
        chips: [ { id, text, correctZone } ],
        zones: [ { id, label } ],
        onAllPlaced: function(),       // called when all chips placed
        onCheck: function(results),    // called after checkAnswers
        feedbackMap: { chipId: { correct: string, incorrect: string } }  // optional
      }
    */
    var inst = {
      config: config,
      placements: {},        // { chipId: zoneId }
      checked: false,
      selectedChip: null     // for tap-to-assign on mobile
    };
    instances[config.instanceId] = inst;

    var container = document.getElementById(config.containerId);
    if (!container) return;

    // Get all chip elements and zone elements
    var chipEls = container.querySelectorAll('.drag-chip[data-chip-id]');
    var zoneEls = container.querySelectorAll('.drop-zone[data-zone]');

    // ─── Desktop: HTML5 Drag and Drop ───

    for (var c = 0; c < chipEls.length; c++) {
      (function(chip) {
        chip.setAttribute('draggable', 'true');

        chip.addEventListener('dragstart', function(e) {
          if (inst.checked) return;
          chip.classList.add('dragging');
          e.dataTransfer.setData('text/plain', chip.getAttribute('data-chip-id'));
          e.dataTransfer.effectAllowed = 'move';
        });

        chip.addEventListener('dragend', function() {
          chip.classList.remove('dragging');
        });

        // Tap-to-assign (mobile) + click to return from zone
        chip.addEventListener('click', function(e) {
          if (inst.checked) return;
          e.preventDefault();

          var chipId = chip.getAttribute('data-chip-id');

          // If chip is in a zone, return it to source
          if (chip.closest('.drop-zone')) {
            returnChipToSource(inst, config, container, chipId);
            return;
          }

          // Select/deselect for tap-to-assign
          if (inst.selectedChip === chipId) {
            chip.classList.remove('selected');
            inst.selectedChip = null;
          } else {
            // Deselect previous
            var prev = container.querySelector('.drag-chip.selected');
            if (prev) prev.classList.remove('selected');
            chip.classList.add('selected');
            inst.selectedChip = chipId;
          }
        });

        // Keyboard: Enter/Space to select chip, then arrows+Enter to place
        chip.setAttribute('tabindex', '0');
        chip.setAttribute('role', 'button');
        chip.addEventListener('keydown', function(e) {
          if (inst.checked) return;
          var chipId = chip.getAttribute('data-chip-id');

          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // If in zone, return to source
            if (chip.closest('.drop-zone')) {
              returnChipToSource(inst, config, container, chipId);
              return;
            }
            // Toggle selection
            if (inst.selectedChip === chipId) {
              chip.classList.remove('selected');
              inst.selectedChip = null;
            } else {
              var prev = container.querySelector('.drag-chip.selected');
              if (prev) prev.classList.remove('selected');
              chip.classList.add('selected');
              inst.selectedChip = chipId;
            }
          }
        });
      })(chipEls[c]);
    }

    // ─── Zone listeners ───

    for (var z = 0; z < zoneEls.length; z++) {
      (function(zone) {
        // Drag over
        zone.addEventListener('dragover', function(e) {
          if (inst.checked) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', function() {
          zone.classList.remove('drag-over');
        });

        // Drop
        zone.addEventListener('drop', function(e) {
          e.preventDefault();
          zone.classList.remove('drag-over');
          if (inst.checked) return;

          var chipId = e.dataTransfer.getData('text/plain');
          if (chipId) {
            placeChipInZone(inst, config, container, chipId, zone.getAttribute('data-zone'));
          }
        });

        // Tap-to-assign: click zone while chip is selected
        zone.addEventListener('click', function(e) {
          if (inst.checked) return;
          if (e.target.closest('.drag-chip')) return; // let chip click handler handle it

          if (inst.selectedChip) {
            placeChipInZone(inst, config, container, inst.selectedChip, zone.getAttribute('data-zone'));
            inst.selectedChip = null;
          }
        });

        // Keyboard: Enter to place selected chip
        zone.setAttribute('tabindex', '0');
        zone.setAttribute('role', 'region');
        zone.addEventListener('keydown', function(e) {
          if (inst.checked) return;
          if (e.key === 'Enter' && inst.selectedChip) {
            e.preventDefault();
            placeChipInZone(inst, config, container, inst.selectedChip, zone.getAttribute('data-zone'));
            inst.selectedChip = null;
          }
        });
      })(zoneEls[z]);
    }

    // ─── Touch events for dragging ───

    var touchChip = null;
    var touchClone = null;

    container.addEventListener('touchstart', function(e) {
      if (inst.checked) return;
      var chip = e.target.closest('.drag-chip[data-chip-id]');
      if (!chip || chip.closest('.drop-zone')) return;

      touchChip = chip;
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
      if (!touchChip || inst.checked) return;
      e.preventDefault();

      if (!touchClone) {
        touchClone = touchChip.cloneNode(true);
        touchClone.style.position = 'fixed';
        touchClone.style.pointerEvents = 'none';
        touchClone.style.zIndex = '9999';
        touchClone.style.opacity = '0.8';
        touchClone.style.transform = 'scale(1.05)';
        document.body.appendChild(touchClone);
        touchChip.classList.add('dragging');
      }

      var touch = e.touches[0];
      touchClone.style.left = (touch.clientX - 40) + 'px';
      touchClone.style.top = (touch.clientY - 20) + 'px';

      // Highlight zone under finger
      var zones = container.querySelectorAll('.drop-zone');
      for (var i = 0; i < zones.length; i++) {
        zones[i].classList.remove('drag-over');
      }
      var targetZone = findZoneUnderPoint(touch.clientX, touch.clientY, zones);
      if (targetZone) targetZone.classList.add('drag-over');
    }, { passive: false });

    container.addEventListener('touchend', function(e) {
      if (!touchChip || inst.checked) return;

      if (touchClone) {
        var touch = e.changedTouches[0];
        var zones = container.querySelectorAll('.drop-zone');
        for (var i = 0; i < zones.length; i++) {
          zones[i].classList.remove('drag-over');
        }
        var targetZone = findZoneUnderPoint(touch.clientX, touch.clientY, zones);
        if (targetZone) {
          var chipId = touchChip.getAttribute('data-chip-id');
          placeChipInZone(inst, config, container, chipId, targetZone.getAttribute('data-zone'));
        }
        document.body.removeChild(touchClone);
        touchClone = null;
      }

      touchChip.classList.remove('dragging');
      touchChip = null;
    }, { passive: true });
  }

  // ─── Place chip in zone ───

  function placeChipInZone(inst, config, container, chipId, zoneId) {
    // Remove from any previous zone
    var prevZone = inst.placements[chipId];
    if (prevZone) {
      var prevZoneEl = container.querySelector('.drop-zone[data-zone="' + prevZone + '"] .chip-in-zone[data-chip-id="' + chipId + '"]');
      if (prevZoneEl) prevZoneEl.remove();
    }

    // Also remove any existing chip in target zone (one chip per zone for RCTF)
    // For quiz sorting, multiple chips per zone is allowed
    if (!config.multiplePerZone) {
      var existingInZone = Object.keys(inst.placements);
      for (var i = 0; i < existingInZone.length; i++) {
        if (inst.placements[existingInZone[i]] === zoneId && existingInZone[i] !== chipId) {
          returnChipToSource(inst, config, container, existingInZone[i]);
        }
      }
    }

    // Record placement
    inst.placements[chipId] = zoneId;

    // Hide source chip
    var sourceChip = container.querySelector('.chips-source .drag-chip[data-chip-id="' + chipId + '"]');
    if (sourceChip) sourceChip.classList.add('placed');

    // Find chip data
    var chipData = null;
    for (var j = 0; j < config.chips.length; j++) {
      if (config.chips[j].id === chipId) { chipData = config.chips[j]; break; }
    }

    // Create chip element in zone
    var zone = container.querySelector('.drop-zone[data-zone="' + zoneId + '"]');
    if (zone && chipData) {
      // Remove placeholder text
      var placeholder = zone.querySelector('.drop-zone-placeholder');
      if (placeholder) placeholder.style.display = 'none';

      var chipEl = document.createElement('div');
      chipEl.className = 'chip-in-zone';
      chipEl.setAttribute('data-chip-id', chipId);
      chipEl.textContent = chipData.text;
      chipEl.style.cursor = 'pointer';
      chipEl.setAttribute('tabindex', '0');
      chipEl.setAttribute('role', 'button');
      chipEl.setAttribute('aria-label', 'Remove ' + chipData.text + ' from ' + zoneId);

      // Click to return
      chipEl.addEventListener('click', function() {
        if (inst.checked) return;
        returnChipToSource(inst, config, container, chipId);
      });
      chipEl.addEventListener('keydown', function(e) {
        if (inst.checked) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          returnChipToSource(inst, config, container, chipId);
        }
      });

      zone.appendChild(chipEl);
    }

    // Deselect
    var selected = container.querySelector('.drag-chip.selected');
    if (selected) selected.classList.remove('selected');
    inst.selectedChip = null;

    // Check if all placed
    var allPlaced = true;
    for (var k = 0; k < config.chips.length; k++) {
      if (!inst.placements[config.chips[k].id]) { allPlaced = false; break; }
    }
    if (allPlaced && config.onAllPlaced) {
      config.onAllPlaced();
    }
  }

  // ─── Return chip to source ───

  function returnChipToSource(inst, config, container, chipId) {
    // Remove from zone
    delete inst.placements[chipId];
    var inZone = container.querySelector('.drop-zone .chip-in-zone[data-chip-id="' + chipId + '"]');
    if (inZone) {
      var zone = inZone.closest('.drop-zone');
      inZone.remove();
      // Show placeholder if zone is now empty
      if (zone && !zone.querySelector('.chip-in-zone')) {
        var placeholder = zone.querySelector('.drop-zone-placeholder');
        if (placeholder) placeholder.style.display = '';
      }
    }

    // Show source chip
    var sourceChip = container.querySelector('.chips-source .drag-chip[data-chip-id="' + chipId + '"]');
    if (sourceChip) sourceChip.classList.remove('placed');
  }

  // ─── Check Answers ───

  function checkAnswers(instanceId) {
    var inst = instances[instanceId];
    if (!inst) return null;
    inst.checked = true;

    var config = inst.config;
    var container = document.getElementById(config.containerId);
    var results = { correct: 0, total: config.chips.length, details: {} };

    for (var i = 0; i < config.chips.length; i++) {
      var chip = config.chips[i];
      var placedZone = inst.placements[chip.id];
      var isCorrect = placedZone === chip.correctZone;
      results.details[chip.id] = { placedZone: placedZone, correctZone: chip.correctZone, correct: isCorrect };
      if (isCorrect) results.correct++;

      // Style the zone
      if (container) {
        var zoneEl = container.querySelector('.drop-zone[data-zone="' + placedZone + '"]');
        var chipInZone = container.querySelector('.chip-in-zone[data-chip-id="' + chip.id + '"]');

        if (chipInZone) {
          if (isCorrect) {
            chipInZone.style.borderColor = 'var(--color-success)';
            // Add feedback
            if (config.feedbackMap && config.feedbackMap[chip.id]) {
              var fb = document.createElement('div');
              fb.className = 'chip-feedback';
              fb.style.color = 'var(--color-success)';
              fb.textContent = config.feedbackMap[chip.id].correct || 'Correct!';
              chipInZone.parentNode.insertBefore(fb, chipInZone.nextSibling);
            }
          } else {
            chipInZone.style.borderColor = 'var(--color-error)';
            if (config.feedbackMap && config.feedbackMap[chip.id]) {
              var fbErr = document.createElement('div');
              fbErr.className = 'chip-feedback';
              fbErr.style.color = 'var(--color-error)';
              fbErr.textContent = config.feedbackMap[chip.id].incorrect || 'Incorrect';
              chipInZone.parentNode.insertBefore(fbErr, chipInZone.nextSibling);
            }
          }
        }

        // Color the zone
        if (zoneEl) {
          // Check if all chips in this zone are correct
          var zoneChips = zoneEl.querySelectorAll('.chip-in-zone');
          var allZoneCorrect = true;
          for (var j = 0; j < zoneChips.length; j++) {
            var cid = zoneChips[j].getAttribute('data-chip-id');
            if (results.details[cid] && !results.details[cid].correct) {
              allZoneCorrect = false;
            }
          }
          if (zoneChips.length > 0) {
            zoneEl.classList.add(allZoneCorrect ? 'correct' : 'incorrect');
          }
        }
      }
    }

    // Disable all chips
    if (container) {
      var allChips = container.querySelectorAll('.drag-chip');
      for (var k = 0; k < allChips.length; k++) {
        allChips[k].style.cursor = 'default';
        allChips[k].removeAttribute('draggable');
      }
    }

    if (config.onCheck) config.onCheck(results);
    return results;
  }

  // ─── Reset ───

  function reset(instanceId) {
    var inst = instances[instanceId];
    if (!inst) return;
    var config = inst.config;
    var container = document.getElementById(config.containerId);

    // Clear all placements
    inst.placements = {};
    inst.checked = false;
    inst.selectedChip = null;

    if (container) {
      // Remove all chips from zones
      var inZoneChips = container.querySelectorAll('.drop-zone .chip-in-zone');
      for (var i = 0; i < inZoneChips.length; i++) {
        inZoneChips[i].remove();
      }

      // Remove all feedback
      var feedbacks = container.querySelectorAll('.chip-feedback');
      for (var j = 0; j < feedbacks.length; j++) {
        feedbacks[j].remove();
      }

      // Show all source chips
      var sourceChips = container.querySelectorAll('.chips-source .drag-chip');
      for (var k = 0; k < sourceChips.length; k++) {
        sourceChips[k].classList.remove('placed', 'selected', 'dragging');
        sourceChips[k].setAttribute('draggable', 'true');
        sourceChips[k].style.cursor = 'grab';
      }

      // Reset zones
      var zones = container.querySelectorAll('.drop-zone');
      for (var l = 0; l < zones.length; l++) {
        zones[l].classList.remove('correct', 'incorrect', 'drag-over');
        var placeholder = zones[l].querySelector('.drop-zone-placeholder');
        if (placeholder) placeholder.style.display = '';
      }
    }
  }

  // ─── Get Results ───

  function getResults(instanceId) {
    var inst = instances[instanceId];
    if (!inst) return null;
    return {
      placements: Object.assign({}, inst.placements),
      checked: inst.checked
    };
  }

  // ─── Export ───

  window.DragDropEngine = {
    init: init,
    checkAnswers: checkAnswers,
    reset: reset,
    getResults: getResults
  };

})();
