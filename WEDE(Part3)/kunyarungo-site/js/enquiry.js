/* enquiry.html: validate, submit with AJAX (fetch), then show an estimated cost and availability.
   The estimate is calculated from data/products.json, also loaded with AJAX. */
(function () {
  'use strict';

  var form = document.getElementById('enquiryForm');
  if (!form || !window.KForms) { return; }

  var productSelect = document.getElementById('product');
  var status = document.getElementById('formStatus');
  var btn = document.getElementById('submitBtn');
  var dateInput = document.getElementById('startDate');
  var products = [];

  /* Earliest date = today (stops past dates in the picker as well as in validation) */
  var t = new Date();
  dateInput.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');

  KForms.attachLive(form);
  KForms.counter(document.getElementById('notes'), 'notes-count', 500);

  function rand(n) { return 'R' + Math.round(n).toLocaleString('en-ZA'); }

  /* Load packages into the dropdown */
  fetch('data/products.json')
    .then(function (r) { if (!r.ok) { throw new Error(); } return r.json(); })
    .then(function (data) {
      products = data;
      productSelect.innerHTML = '<option value="">Select a package</option>';
      data.forEach(function (p) {
        var o = document.createElement('option');
        o.value = p.id;
        o.textContent = p.name;
        productSelect.appendChild(o);
      });
      /* Pre-select when arriving from the products page (?product=id) */
      var wanted = new URLSearchParams(window.location.search).get('product');
      if (wanted) { productSelect.value = wanted; }
    })
    .catch(function () {
      productSelect.innerHTML = '<option value="">Packages unavailable. Please refresh.</option>';
    });

  function buildEstimate(values) {
    var p = products.filter(function (x) { return x.id === values.product; })[0];
    if (!p) { return null; }
    var hectares = parseFloat(values.hectares);
    var units = Math.max(1, Math.ceil(hectares / p.hectaresPerKit));
    var subtotal = units * p.price;
    /* Indicative installation allowance of 12% for kits (not for consultations) */
    var install = p.category === 'Consultation services' ? 0 : subtotal * 0.12;
    var total = subtotal + install;

    var earliest = new Date();
    earliest.setDate(earliest.getDate() + p.leadTimeDays + (units > 1 ? 7 : 0));
    var wanted = new Date(values.startDate + 'T00:00:00');
    var canMeet = wanted >= earliest;

    return {
      product: p, units: units, subtotal: subtotal, install: install, total: total,
      earliest: earliest, canMeet: canMeet
    };
  }

  function formatDate(d) {
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function showResult(values, est) {
    var e = KForms.escapeHtml;
    var typeText = { product: 'product enquiry', consultation: 'consultation request', quote: 'quote request' }[values.enquiryType] || 'enquiry';
    var html = '<h3 style="margin-top:0">Thank you, ' + e(values.fullName.split(' ')[0]) + '. Your ' + typeText + ' was received.</h3>';
    if (est) {
      html += '<p><strong>' + e(est.product.name) + '</strong> for about ' + e(values.hectares) + ' ha in ' + e(values.province) + ':</p>' +
        '<ul>' +
        '<li>Units needed: ' + est.units + '</li>' +
        '<li>Equipment: ' + rand(est.subtotal) + '</li>' +
        (est.install ? '<li>Estimated installation (12%): ' + rand(est.install) + '</li>' : '') +
        '<li><strong>Estimated total: ' + rand(est.total) + '</strong> (indicative, excludes VAT; the final quote follows a site assessment)</li>' +
        '</ul>' +
        '<p><strong>Availability:</strong> ' + e(est.product.stock) + '. ' +
        (est.canMeet
          ? 'We can meet your preferred date of ' + formatDate(new Date(values.startDate + 'T00:00:00')) + '.'
          : 'The earliest we can install is about ' + formatDate(est.earliest) + ', which is later than your preferred date.') +
        '</p>';
    }
    html += '<p>We will contact you at ' + e(values.email) + ' or ' + e(values.phone) + ' within two working days.</p>';
    KForms.setStatus(status, 'success', html);
  }

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    status.className = 'form-status';

    if (!KForms.validateForm(form)) {
      KForms.setStatus(status, 'fail', 'Please fix the highlighted fields and try again.');
      return;
    }

    /* Spam trap: bots fill the hidden field */
    if (form.elements.website && form.elements.website.value) { return; }

    var values = {};
    new FormData(form).forEach(function (v, k) { values[k] = v; });

    var est = buildEstimate(values);
    btn.disabled = true;
    form.classList.add('loading');

    /* AJAX submission: POST the data to the form's action URL without reloading the page. */
    fetch(form.getAttribute('action'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: KForms.encode(form)
    })
      .then(function (res) {
        /* On local servers the action URL may not accept POST; the estimate is still shown
           because it is calculated in the browser. A real server error on the live site is reported. */
        if (!res.ok && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          throw new Error('HTTP ' + res.status);
        }
        showResult(values, est);
        form.reset();
        form.querySelectorAll('.valid, .invalid').forEach(function (f) { f.classList.remove('valid', 'invalid'); });
        KForms.counter(document.getElementById('notes'), 'notes-count', 500);
      })
      .catch(function () {
        KForms.setStatus(status, 'fail', 'Sorry, we could not send your enquiry right now. Please check your connection and try again, or email <a href="mailto:info@kunyarungo.co.za">info@kunyarungo.co.za</a>.');
      })
      .finally(function () {
        btn.disabled = false;
        form.classList.remove('loading');
      });
  });
})();
