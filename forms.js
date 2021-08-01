/**
 * Serialize all form data into an array
 * https://kbarker.dev/blog/serialize-form-data-into-an-array-in-vanilla-js/
 * @param {HTMLFormElement} form The form to serialize
 * @returns {Array} The serialized form data
 */
function serializeArray(form) {
  // Create a new FormData object
  const formData = new FormData(form);

  // Create an array to hold the name/value pairs
  const pairs = [];

  // Add each name/value pair to the array
  for (const [name, value] of formData) {
    pairs.push({ name, value });
  }

  // Return the array
  return pairs;
}

export function serializeJSON(form, initial, omit_nulls) {
  let params = {};
  let values = serializeArray(form);

  let checked = form.querySelectorAll("input[type=checkbox]:checked");
  checked.forEach(checkbox => {
    values.push({ name: checkbox.name, value: true });
  });

  let unchecked = form.querySelectorAll("input[type=checkbox]:not(:checked)");
  unchecked.forEach(checkbox => {
    values.push({ name: checkbox.name, value: false });
  });

  // Check that values have changed
  values.map(x => {
    if (omit_nulls) {
      if (x.value !== null && x.value !== "") {
        params[x.name] = x.value;
      } else {
        let input = form.querySelector(`[name='${x.name}']`);
        if (initial[input.name] !== input.value) {
          params[x.name] = x.value;
        }
      }
    } else {
      params[x.name] = x.value;
    }
  });
  return params;
}
