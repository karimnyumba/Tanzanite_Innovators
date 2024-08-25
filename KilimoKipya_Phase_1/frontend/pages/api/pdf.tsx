
export default async function handler(req:any, res:any) {
    const url = process.env.URL

  if (req.method === 'POST') {
    const { data } = req.body;

    try {
        console.log("here")
        const response = await fetch(`${url}/download/pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          console.log("here")
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

      res.status(200).send(buffer);
    } catch (error) {
      console.error('Error Generate pdf api:', error);
      res.status(500).json({ error: 'Error Generate pdf api' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}