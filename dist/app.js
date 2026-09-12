'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; navigation.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open)); });
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if(event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
document.querySelector('#year').textContent = String(new Date().getFullYear());

const config = window.FIELDWORK_CONFIG || {};
function safeWebUrl(value) { try { const url = new URL(value, location.href); return ['https:', 'http:'].includes(url.protocol) && (url.protocol === 'https:' || url.origin === location.origin) && !url.username && !url.password ? url.href : ''; } catch { return ''; } }
const endpoint = config.formEndpoint ? safeWebUrl(config.formEndpoint) : '';
const usesFormSubmit = endpoint && new URL(endpoint).hostname === 'formsubmit.co';
const bookingUrl = config.bookingUrl ? safeWebUrl(config.bookingUrl) : '';
const email = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(config.contactEmail || '') ? config.contactEmail : '';
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const downloadLink = document.querySelector('#download-request');
const submitButton = form.querySelector('button[type="submit"]');
const submitLabel = document.querySelector('#submit-label');
let requestBlobUrl;
if (bookingUrl) { const link = document.querySelector('#direct-booking'); link.href = bookingUrl; link.hidden = false; }
if (!endpoint && !email) { document.querySelector('#setup-notice').hidden = false; submitLabel.textContent = 'Preview my call request'; }
if (!endpoint && email) submitLabel.textContent = 'Prepare an email request';
document.querySelectorAll('[data-trade]').forEach(link => link.addEventListener('click', () => { document.querySelector('#trade-select').value = link.dataset.trade; }));
function showStatus(message, error = false) { status.textContent = message; status.hidden = false; status.classList.toggle('is-error', error); status.focus(); }
function requestText(data) { return ['Fit call request — Fieldwork Growth', '', ...Object.entries(data).filter(([key]) => key !== 'website_url').map(([key,value]) => `${key[0].toUpperCase()}${key.slice(1)}: ${value || '(not supplied)'}`)].join('\n'); }
function offerDownload(data) { if (requestBlobUrl) URL.revokeObjectURL(requestBlobUrl); requestBlobUrl = URL.createObjectURL(new Blob([requestText(data)], {type:'text/plain;charset=utf-8'})); downloadLink.href = requestBlobUrl; downloadLink.download = 'fieldwork-fit-call-request.txt'; downloadLink.hidden = false; }
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  if (data.website_url) return;
  for (const key of ['name','company','territory']) { if (!data[key].trim()) { showStatus('Please complete your name, company, and service area.', true); form.elements[key].focus(); return; } }
  data.source = 'Fieldwork Growth website';
  downloadLink.hidden = true;
  if (!endpoint) {
    offerDownload(data);
    if (email) { const mailto = `mailto:${email}?subject=${encodeURIComponent('Fit call request — '+data.company)}&body=${encodeURIComponent(requestText(data))}`; const mailLink = document.createElement('a'); mailLink.href = mailto; mailLink.textContent = 'Open your email app to send the request ↗'; mailLink.className = 'text-link'; showStatus('Your request is prepared, but has not been sent. Open your email app below to review and send it, or save a copy.'); status.append(document.createElement('br'),mailLink); }
    else showStatus('Preview complete. Nothing has been sent or booked. Online inquiries are not connected yet; you can save a copy of this request below.');
    return;
  }
  const payload = usesFormSubmit ? { ...data, _subject: 'New fit call request — Fieldwork Growth', _template: 'table', _replyto: data.email, _honey: data.website_url, _url: location.origin + location.pathname } : data;
  const previousLabel = submitLabel.textContent;
  submitButton.disabled = true;
  submitLabel.textContent = 'Sending your request…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
    if (!response.ok) throw new Error('Submission failed');
    if (usesFormSubmit) {
      const result = await response.json();
      if (result.success !== true && result.success !== 'true') throw new Error('Submission not accepted');
      if (/activat|confirm your email/i.test(result.message || '')) throw new Error('Email destination is not active');
    }
    showStatus('Your request has been received. We’ll follow up using the details you shared to arrange a fit call. No appointment has been booked yet.');
    form.reset();
  } catch {
    offerDownload(data);
    showStatus('We couldn’t confirm that your request was received. Your details are still here. Please try again, or save a copy below.',true);
  } finally { clearTimeout(timeout); submitButton.disabled = false; submitLabel.textContent = previousLabel; }
});
