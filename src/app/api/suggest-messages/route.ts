import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const prompt =
      body?.prompt ||
      "Generate 3 interesting anonymous questions for a friend.";

    const apiKey = process.env.KIE_API_KEY;

    if (!apiKey) {
      console.error("KIE_API_KEY is missing");

      return NextResponse.json(
        {
          success: false,
          message: "KIE API key is not configured",
        },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://api.kie.ai/gemini/v1/models/gemini-3-8-flash:generateContent",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `


Generate exactly 3 interesting and friendly anonymous questions.

Rules:

Return ONLY the 3 questions.

Separate each question with ||.

Do NOT use numbers.

Do NOT use bullet points.

Do NOT use markdown.

Do NOT add explanations.

Do NOT add quotation marks.

Keep each question reasonably short.

Avoid sensitive or inappropriate topics.

Example:
What's a hobby you've recently started? || If you could learn any new skill, what would it be? || What's something that always makes you smile?

User request:
${prompt}
`.trim(),
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    console.log("KIE HTTP status:", response.status);
    console.log("KIE response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "KIE API request failed",
          error: data,
        },
        { status: response.status },
      );
    }

    /*
     * KIE can return an HTTP 200 while the model/API itself
     * reports an internal error using code: 500.
     */
    if (data?.code && data.code !== 200) {
      return NextResponse.json(
        {
          success: false,
          message: data.msg || "KIE API request failed",
          error: data,
        },
        { status: 502 },
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("")
        .trim() || "";

    if (!text) {
      console.error("KIE returned no generated text");

      return NextResponse.json(
        {
          success: false,
          message: "KIE returned an empty response",
        },
        { status: 502 },
      );
    }

    /*
     * First try the requested || format.
     */
    let suggestions = text
      .split("||")
      .map((item: string) => item.trim())
      .filter(Boolean);

    /*
     * Fallback:
     * If the model ignored the || instruction and returned
     * numbered Markdown questions, extract those questions.
     */
    if (suggestions.length < 3) {
      suggestions = text
        .split(/\n+/)
        .map((line: string) =>
          line
            .replace(/^\s*\d+[\.\)]\s*/, "")
            .replace(/\*\*/g, "")
            .replace(/^["']|["']$/g, "")
            .trim(),
        )
        .filter(
          (line: string) =>
            line.length > 10 && !line.startsWith("*") && !line.startsWith("("),
        );
    }

    suggestions = suggestions
      .map((item: string) =>
        item
          .replace(/\*\*/g, "")
          .replace(/^["']|["']$/g, "")
          .trim(),
      )
      .filter(Boolean)
      .slice(0, 3);

    if (suggestions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not parse AI suggestions",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        suggestions,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("KIE API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate message suggestions",
      },
      { status: 500 },
    );
  }
}
