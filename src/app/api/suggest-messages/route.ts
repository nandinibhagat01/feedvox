export async function POST(request: Request) {
  try {
    const prompt = `
Create a list of three open-ended and engaging questions formatted as a single string. 
Each question should be separated by '||'.

These questions are for an anonymous social messaging platform, like Qooh.me, 
and should be suitable for a diverse audience.

Avoid personal or sensitive topics, focusing instead on universal themes that 
encourage friendly interaction.

For example, your output should be structured like this:

"What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?"

Ensure the questions are intriguing, foster curiosity, and contribute to a 
positive and welcoming conversational environment.

Return only the three questions separated by '||'.
Do not add numbers, bullet points, quotation marks, or any additional explanation.
`;

    const response = await fetch(
      "https://api.kie.ai/gemini/v1/models/gemini-3-8-flash:streamGenerateContent",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KIE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stream: false,
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    console.log("KIE status:", response.status);
    console.log("KIE response:", data);

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message: "KIE API request failed",
          error: data,
        },
        {
          status: response.status,
        },
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("") || "";

    const suggestions = text
      .split("||")
      .map((question: string) => question.trim())
      .filter((question: string) => question.length > 0)
      .slice(0, 3);

    return Response.json(
      {
        success: true,
        suggestions,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("KIE API error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate message suggestions",
      },
      {
        status: 500,
      },
    );
  }
}
