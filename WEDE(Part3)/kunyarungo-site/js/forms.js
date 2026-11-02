/* Shared client-side form validation helpers (used by enquiry.html and contact.html).
   Exposes window.KForms. Validation is done with JavaScript on top of HTML5 attributes. */
(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  /* South African numbers: 0XX XXX XXXX (10 digits) or +27XX XXX XXXX */
  var PHONE_RE = /^(?:\+27|0)[1-9][0-9]{8}$/;
  var NAME_RE = /^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ\s'\-.]*$/;

  function errorEl(field) {
    return document.getElementById(field.id + '-err');
  }

  function check(field) {
    var value = field.type === 'checkbox' ? field.checked : field.value.trim();
    var label = (field.getAttribute('data-label') || 'This field');

    if (field.required && (field.type === 'checkbox' ? !value : value === '')) {
      return field.type === 'checkbox' ? 'You must agree before submitting.' : 'Please fill in this field.';
    }
    if (value === '' || field.type === 'checkbox') { return ''; }

    var id = field.id;
    var type = field.type;

    if (type === 'email' && !EMAIL_RE.test(value)) {
      return 'Enter a valid email address, e.g. name@example.com.';
    }
    if (type === 'tel') {
      var digits = value.replace(/[\s\-()]/g, '');
      if (!PHONE_RE.test(digits)) { return 'Enter a valid South African number, e.g. 082 123 4567 or +27 82 123 4567.'; }
    }
    if ((id === 'fullName' || id === 'cName') && !NAME_RE.test(value)) {
      return 'Names can only contain letters, spaces, apostrophes and hyphens.';
    }
    if (field.minLength > 0 && value.length < field.minLength) {
      return 'Please enter at least ' + field.minLength + ' characters (you have ' + value.length + ').';
    }
    if (field.maxLength > 0 && field.maxLength < 100000 && value.length > field.maxLength) {
      return 'Please keep this under ' + field.maxLength + ' characters.';
    }
    if (type === 'number') {
      var n = parseFloat(value);
      if (isNaN(n)) { return 'Enter a number.'; }
      if (field.min !== '' && n < parseFloat(field.min)) { return 'The minimum is ' + field.min + '.'; }
      if (field.max !== '' && n > parseFloat(field.max)) { return 'The maximum is ' + field.max + '.'; }
    }
    if (type === 'date') {
      var chosen = new Date(value + 'T00:00:00');
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var limit = new Date(today);
      limit.setFullYear(limit.getFullYear() + 2);
      if (isNaN(chosen.getTime())) { return 'Enter a valid date.'; }
      if (chosen < today) { return 'Please choose today or a future date.'; }
      if (chosen > limit) { return 'Please choose a date within the next two years.'; }
    }
    return '';
  }

  function show(field, message) {
    var err = errorEl(field);
    if (err) { err.textContent = message; }
    field.classList.toggle('invalid', !!message);
    field.classList.toggle('valid', !message && field.type !== 'checkbox' && field.value.trim() !== '');
    if (message) { field.setAttribute('aria-invalid', 'true'); } else { field.removeAttribute('aria-invalid'); }
  }

  function validateField(field) {
    var msg = check(field);
    show(field, msg);
    return msg === '';
  }

  /* Validate every field in the form; focus the first invalid one. */
  function validateForm(form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'))
      .filter(function (f) { return f.name !== 'website' && f.type !== 'hidden'; });
    var firstBad = null;
    var ok = true;
    fields.forEach(function (f) {
      if (!validateField(f)) { ok = false; if (!firstBad) { firstBad = f; } }
    });
    if (firstBad) { firstBad.focus(); }
    return ok;
  }

  /* Live feedback: validate on blur, re-validate while typing once the field is flagged. */
  function attachLive(form) {
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      if (f.name === 'website' || f.type === 'hidden') { return; }
      f.addEventListener('blur', function () { validateField(f); });
      f.addEventListener(f.type === 'checkbox' || f.tagName === 'SELECT' ? 'change' : 'input', function () {
        if (f.classList.contains('invalid')) { validateField(f); }
      });
    });
  }

  function counter(textarea, outputId, max, min) {
    var out = document.getElementById(outputId);
    if (!textarea || !out) { return; }
    function update() {
      out.textContent = textarea.value.length + ' / ' + max + ' characters' + (min ? ' (minimum ' + min + ')' : '');
    }
    textarea.addEventListener('input', update);
    update();
  }

  function setStatus(box, type, html) {
    box.className = 'form-status show ' + type;
    box.innerHTML = html;
    box.focus();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Encode a form for a url-encoded AJAX POST (needed for Netlify Forms). */
  function encode(form) {
    var data = new FormData(form);
    var pairs = [];
    data.forEach(function (v, k) { pairs.push(encodeURIComponent(k) + '=' + encodeURIComponent(v)); });
    return pairs.join('&');
  }

  window.KForms = {
    validateField: validateField,
    validateForm: validateForm,
    attachLive: attachLive,
    counter: counter,
    setStatus: setStatus,
    escapeHtml: escapeHtml,
    encode: encode
  };
})();
