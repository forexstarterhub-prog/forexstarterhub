exports.handler = async function(event) {

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Parse the form data
  let name, email;
  try {
    const params = new URLSearchParams(event.body);
    name  = params.get('first_name') || '';
    email = params.get('email')      || '';
  } catch(e) {
    return { statusCode: 400, body: 'Bad Request' };
  }

  // Basic validation
  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: 'Invalid email' };
  }

  // Your Beehiiv credentials — replace these two values
  const BEEHIIV_API_KEY    = '0X1i44b5SU9GiQOzdGj2zgIxqYfjuKx8XmDLhDtBYgvMnbvzNe5gjvB7xYcRLr3p';       // bh_...
  const BEEHIIV_PUB_ID     = 'pub_0ffe14f8-f9f7-4699-8b5b-ce3618a79ce2'; // pub_...

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`
        },
        body: JSON.stringify({
          email:                email,
          first_name:           name,
          utm_source:           'landing_page',
          utm_medium:           'organic',
          reactivate_existing:  false,
          send_welcome_email:   false
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Beehiiv error:', err);
      return { statusCode: 500, body: 'Beehiiv error' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch(e) {
    console.error('Function error:', e);
    return { statusCode: 500, body: 'Server error' };
  }
};
