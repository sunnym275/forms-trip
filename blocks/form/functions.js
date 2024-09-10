/**
 * Submit form in excel
 * @name submitToSpreadSheet Submit data to Spreadsheet
 * @param {string} url in spreadsheet
 */
function submitToSpreadSheet(url, ...args) {
  const form = document.querySelector('form');
  const valid = form.checkValidity();
  if (valid) {
    const [globals] = args;
    const data = globals.functions.exportData();
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          submitFailure({}, form);
        } else {
          submitSuccess({}, form);
        }
      })
      .catch(() => {
        submitFailure({}, form);
      });
  }
}

// eslint-disable-next-line import/prefer-default-export
export { submitToSpreadSheet };
