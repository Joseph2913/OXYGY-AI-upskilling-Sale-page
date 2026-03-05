/* =================================================================
   CardFlipEngine — Reusable 3D flip card engine for SCORM course
   Used by: Slide 07 (Role & Context), Slide 10 (Four Techniques)

   API:
     window.CardFlipEngine.init(config)
     window.CardFlipEngine.flipAll(instanceId)
     window.CardFlipEngine.resetAll(instanceId)
     window.CardFlipEngine.allFlipped(instanceId)
   ================================================================= */

(function() {
  'use strict';

  var instances = {};

  function init(config) {
    /*
      config = {
        instanceId: string,
        containerId: string,
        cardIds: [string],           // DOM ids of .flip-card elements
        onAllFlipped: function(),    // called when every card flipped at least once
        onFlip: function(cardId, isFlipped)
      }
    */
    var inst = {
      config: config,
      flippedOnce: {},   // { cardId: true } — tracks if card has been flipped at least once
      currentState: {}   // { cardId: true/false } — current flip state
    };
    instances[config.instanceId] = inst;

    for (var i = 0; i < config.cardIds.length; i++) {
      inst.currentState[config.cardIds[i]] = false;
    }

    var container = document.getElementById(config.containerId);
    if (!container) return;

    for (var j = 0; j < config.cardIds.length; j++) {
      (function(cardId) {
        var card = document.getElementById(cardId);
        if (!card) return;

        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Click to flip card');

        card.addEventListener('click', function(e) {
          // Don't flip if clicking an internal link/button
          if (e.target.closest('button') || e.target.closest('a')) return;
          toggleCard(inst, cardId);
        });

        card.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCard(inst, cardId);
          }
        });
      })(config.cardIds[j]);
    }
  }

  function toggleCard(inst, cardId) {
    var card = document.getElementById(cardId);
    if (!card) return;

    var isFlipped = inst.currentState[cardId];
    inst.currentState[cardId] = !isFlipped;

    if (!isFlipped) {
      card.classList.add('flipped');
    } else {
      card.classList.remove('flipped');
    }

    // Track flipped-once
    inst.flippedOnce[cardId] = true;

    if (inst.config.onFlip) {
      inst.config.onFlip(cardId, inst.currentState[cardId]);
    }

    // Check if all flipped at least once
    if (allFlipped(inst.config.instanceId) && inst.config.onAllFlipped) {
      inst.config.onAllFlipped();
    }
  }

  function flipAll(instanceId) {
    var inst = instances[instanceId];
    if (!inst) return;

    for (var i = 0; i < inst.config.cardIds.length; i++) {
      var cardId = inst.config.cardIds[i];
      var card = document.getElementById(cardId);
      if (!card) continue;

      // Flip to back if not already
      if (!inst.currentState[cardId]) {
        inst.currentState[cardId] = true;
        card.classList.add('flipped');
        inst.flippedOnce[cardId] = true;
      }
    }

    if (inst.config.onAllFlipped) {
      inst.config.onAllFlipped();
    }
  }

  function resetAll(instanceId) {
    var inst = instances[instanceId];
    if (!inst) return;

    for (var i = 0; i < inst.config.cardIds.length; i++) {
      var cardId = inst.config.cardIds[i];
      var card = document.getElementById(cardId);
      if (!card) continue;

      inst.currentState[cardId] = false;
      card.classList.remove('flipped');
    }
  }

  function allFlipped(instanceId) {
    var inst = instances[instanceId];
    if (!inst) return false;

    for (var i = 0; i < inst.config.cardIds.length; i++) {
      if (!inst.flippedOnce[inst.config.cardIds[i]]) return false;
    }
    return true;
  }

  window.CardFlipEngine = {
    init: init,
    flipAll: flipAll,
    resetAll: resetAll,
    allFlipped: allFlipped
  };

})();
