const { z } = require('zod');

async function validateLead(postData) {
  const lead = z.object({
    email: z.string().email()
  });

  let message;
  let hasError;
  let validataData = {};
  try {
    validData = lead.parse(postData);
    hasError = false;
  } catch(error) {
    hasError = true;
    message = 'Invalid email, please try again.'
  }

  return {
    data: validData,
    hasError,
    message,
  }
}

module.exports.validateLead = validateLead;