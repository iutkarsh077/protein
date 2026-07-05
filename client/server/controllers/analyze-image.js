const analyzeImage = async (req, res) => {
  try {
    const { key, id } = req.body ?? {};

    if (!key || !id) {
      return res.status(400).json({ message: "key and id are required" });
    }

    const fastapiUrl = process.env.FASTAPI_BACKEND;
    if (!fastapiUrl) {
      return res.status(500).json({ message: "FASTAPI_BACKEND is not configured" });
    }

    const response = await fetch(`${fastapiUrl}/analyze-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, id }),
      signal: AbortSignal.timeout(25000),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("analyze-image proxy failed:", data);
      return res.status(502).json({ message: "Failed to start image analysis" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("analyze-image proxy failed:", error);
    return res.status(502).json({ message: "Failed to start image analysis" });
  }
};

export default analyzeImage;
