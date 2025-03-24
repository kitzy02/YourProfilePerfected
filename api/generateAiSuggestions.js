module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { profileData } = req.body;

    if (!profileData) {
        return res.status(400).json({ error: "Missing profile data" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: "You are an AI career advisor." },
                    { role: "user", content: `Analyze the following profile data and suggest improvements:\n${JSON.stringify(profileData)}` }
                ],
                temperature: 0.7
            })
        });

        const result = await response.json();
        return res.status(200).json({ suggestions: result.choices[0].message.content });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
