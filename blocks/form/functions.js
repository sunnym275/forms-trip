
function submitSuccess(e, form) {
  const { payload } = e;
  if (payload && payload.body && payload.body.redirectUrl) {
    window.location.assign(encodeURI(payload.body.redirectUrl));
  } else {
    let thankYouMessage = form.querySelector('.form-message.success-message');
    if (!thankYouMessage) {
      thankYouMessage = document.createElement('div');
      thankYouMessage.className = 'form-message success-message';
    }
    thankYouMessage.innerHTML = (payload && payload.body) ? payload.body.thankYouMessage : 'Thanks for your submission';
    form.prepend(thankYouMessage);
    if (thankYouMessage.scrollIntoView) {
      thankYouMessage.scrollIntoView({ behavior: 'smooth' });
    }
    form.reset();
  }
  form.setAttribute('data-submitting', 'false');
  const submit = form.querySelector('button[type="submit"]');
  if (submit) {
    submit.disabled = false;
  }
}

function submitFailure(e, form) {
  let errorMessage = form.querySelector('.form-message.error-message');
  if (!errorMessage) {
    errorMessage = document.createElement('div');
    errorMessage.className = 'form-message error-message';
  }
  errorMessage.innerHTML = 'Some error occured while submitting the form'; // TODO: translation
  form.prepend(errorMessage);
  errorMessage.scrollIntoView({ behavior: 'smooth' });
  form.setAttribute('data-submitting', 'false');
  const submit = form.querySelector('button[type="submit"]');
  if (submit) {
    submit.disabled = false;
  }
}

/**
 * Submit form in excel
 * @name submitToSpreadSheet Submit data to Spreadsheet
 * @param {string} url in spreadsheet
 */
function submitToSpreadSheet(url, ...args) {
  const form = document.querySelector('form');
  const valid = form.checkValidity();
  if (valid) {
    const globals = args[0];
    const data = globals.functions.exportData();
    const response = fetch(url, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      submitFailure({}, form);
    } else {
      submitSuccess({}, form);
    }
  }
}

// eslint-disable-next-line import/prefer-default-export
export { submitToSpreadSheet };
