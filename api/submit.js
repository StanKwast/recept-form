export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { filename, recipe } = req.body;
  if (!filename || !recipe) return res.status(400).send('Missing data');

  const path = `recipes/${filename}`;
  const content = Buffer.from(JSON.stringify(recipe, null, 2)).toString('base64');

  // Check if the file already exists to get its SHA
  let sha = undefined;
  const checkResponse = await fetch(`https://api.github.com/repos/StanKwast/koken/contents/${path}`, {
    method: "GET",
    headers: {
      "Authorization": `token ${process.env.GITHUB_TOKEN}`,
      "Accept": "application/vnd.github.v3+json"
    }
  });

  if (checkResponse.ok) {
    const data = await checkResponse.json();
    sha = data.sha; // needed to overwrite
  }

  // Now send the PUT request with (or without) the SHA
  const response = await fetch(`https://api.github.com/repos/StanKwast/koken/contents/${path}`, {
    method: "PUT",
    headers: {
      "Authorization": `token ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      message: sha ? `Update recipe: ${recipe.title}` : `Add recipe: ${recipe.title}`,
      content,
      ...(sha && { sha }) // only include sha if file exists
    })
  });

  if (response.ok) {
    return res.status(200).send("Recipe saved.");
  } else {
    const err = await response.json();
    return res.status(500).json({ message: err.message });
  }
}
