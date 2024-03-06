import { z } from 'zod';

export async function validateLead(postData: { email: string }) {
  const lead = z.object({
    email: z.string().email()
  });

  let message = '';
  let hasError = false;
  let validateData = { email: '' };
  try {
    validateData = lead.parse(postData);
  } catch(error) {
    hasError = true;
    message = 'Invalid email, please try again.'
  }

  return {
    data: validateData,
    hasError,
    message,
  }
}
