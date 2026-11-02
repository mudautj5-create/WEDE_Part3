/* contact.html: validate the message form, submit it with AJAX, then compile the details
   into an email the visitor can send to the recipient defined below. */
(function () {
  'use strict';

  var RECIPIENT = 'info@kunyarungo.co.za';   /* email recipient stated in the code */

  var form = document.getElementById('contactForm');
  if (!form || !window.KForms) { return; }

  var status = document.getElementById('contactStatus');
  var btn = document.getElementById('cSubmit');

  KForms.attachLive(form);
  KForms.counter(document.getElementById('cMessage'), 'cMessage-count', 1000, 20);

  function buildEmail(v) {
    var subject = 'Website message: ' + v.messageType + ' from ' + v.name;
    var body = [
      'Hello Kunyarungo AgriTech team,',
      '',
      v.message,
      '',
      '--- Contact details ---',
      'Name: ' + v.name,
      'Email: ' + v.email,
      'Phone: ' + v.phone,
      'Type of message: ' + v.messageType
    ].join('\n');
    return { subject: subject, body: body };
  }

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    status.className = 'form-status';

    if (!KForms.validateForm(form)) {
      KForms.setStatus(status, 'fail', 'Please fix the highlighted fields and try again.');
      return;
    }
    if (form.elements.website && form.elements.website.value) { return; }

    var values = {};
    new FormData(form).forEach(function (v, k) { values[k] = v; });
    var mail = buildEmail(values);
    var mailto = 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(mail.subject) + '&body=' + encodeURIComponent(mail.body);
    var e = KForms.escapeHtml;

    btn.disabled = true;
    form.classList.add('loading');

    /* AJAX submission (kept silent: the email compile below works even if this call fails) */
    var sent = fetch(form.getAttribute('action'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: KForms.encode(form)
    }).then(function (r) { return r.ok; }).catch(function () { return false; });

    sent.then(function (saved) {
      var html = '<h3 style="margin-top:0">Your message is ready, ' + e(values.name.split(' ')[0]) + '.</h3>' +
        (saved ? '<p>We have received a copy on our website.</p>' : '') +
        '<p>Review the email below, then press <strong>Send email</strong> to send it from your own email app to <strong>' + e(RECIPIENT) + '</strong>.</p>' +
        '<p><strong>Subject:</strong> ' + e(mail.subject) + '</p>' +
        '<pre style="white-space:pre-wrap;background:#fff;padding:.75rem;border-radius:8px;border:1px solid #ccc">' + e(mail.body) + '</pre>' +
        '<p><a class="btn" href="' + e(mailto) + '">Send email</a></p>';
      KForms.setStatus(status, 'success', html);
    }).finally(function () {
      btn.disabled = false;
      form.classList.remove('loading');
    });
  });
})();
