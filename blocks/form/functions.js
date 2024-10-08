
function flattenObject(obj, parentKey = '', result = {}) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                flattenObject(obj[key], newKey, result);
            } else if (Array.isArray(obj[key])) {
                if (obj[key].every(item => typeof item === 'object' && !Array.isArray(item))) {
                    const concatenatedValues = obj[key].map(item => Object.values(item).join(',')).join(',');
                    result[newKey] = concatenatedValues;
                } else {
                    obj[key].forEach((item, index) => {
                        flattenObject(item, `${newKey}[${index}]`, result);
                    });
                }
            } else {
                result[newKey] = obj[key];
            }
        }
    }
    return result;
}

function submitSuccess(e, form) {
  const { payload } = e;
  if (payload && payload.body && payload.body.redirectUrl) {
    window.location.assign(encodeURI(payload.body.redirectUrl));
  } else {
    let thankYouMessage = form.parentNode.querySelector('.form-message.success-message');
    if (!thankYouMessage) {
      thankYouMessage = document.createElement('div');
      thankYouMessage.className = 'form-message success-message';
    }
    thankYouMessage.innerHTML = (payload && payload.body) ? payload.body.thankYouMessage : 'Thanks for your submission';
    form.parentNode.insertBefore(thankYouMessage, form);
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
 * @param {scope=}  globals - The global object containing necessary globals form data.
 */
async function submitToSpreadSheet(url, args) {
  const form = document.querySelector('form');
  const valid = form.checkValidity();
  if (valid) {
    // const globals = args[0];
    const data = flattenObject(myForm.exportData());
    const response = await fetch(url, {
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
