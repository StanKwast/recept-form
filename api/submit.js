export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { filename, recipe } = req.body;
  if (!filename || !recipe) return res.status(400).send('Missing data');

  const content = Buffer.from(JSON.stringify(recipe, null, 2)).toString('base64');

  const response = await fetch(`https://api.github.com/repos/YOUR_USER/YOUR_REPO/contents/recipes/${filename}`, {
    method: "PUT",
    headers: {
      "Authorization": `token ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      message: `Add recipe: ${recipe.title}`,
      content
    })
  });

  if (response.ok) {
    return res.status(200).send("Recipe saved.");
  } else {
    const err = await response.json();
    return res.status(500).json({ message: err.message });
  }
}
