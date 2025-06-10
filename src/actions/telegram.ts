'use server';

export async function notifyTelegram({ message }: { message: string }) {

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
  }

  if (!TELEGRAM_CHAT_ID) {
    throw new Error("TELEGRAM_CHAT_ID environment variable is not set");
  }

  if (!message.trim()) {
    throw new Error("Message cannot be empty");
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = `Telegram API error (${res.status} ${res.statusText})`;
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.description) {
          errorMessage += `: ${errorData.description}`;
        }
      } catch {
        if (errorText) {
          errorMessage += `: ${errorText}`;
        }
      }
      
      console.error("Failed to send Telegram message:", errorMessage);
      throw new Error(errorMessage);
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Telegram API error") || 
          error.message.includes("environment variable") ||
          error.message.includes("Message cannot be empty")) {
        throw error;
      }
      
      console.error("Network error sending Telegram message:", error.message);
      throw new Error(`Failed to send Telegram message: ${error.message}`);
    }
    
    console.error("Unknown error sending Telegram message:", error);
    throw new Error("Failed to send Telegram message: Unknown error occurred");
  }
}