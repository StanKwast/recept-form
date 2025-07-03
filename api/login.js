export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password required' });
  }

  // Check password against environment variable
  if (password === process.env.RECIPE_PASSWORD) {
    // Set a cookie valid for 1 day
    res.setHeader('Set-Cookie', `auth=1; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);
    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid password' });
  }
}
