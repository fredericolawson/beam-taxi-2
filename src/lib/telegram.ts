export class TelegramBot {
  private botToken: string;
  private baseUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN!;
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(
    chatId: string | number,
    options: {
      text: string;
      reply_markup?: any;
    }
  ) {
    const response = await fetch(`${this.baseUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: options.text,
        reply_markup: options.reply_markup,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      console.error('Telegram API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorResponse: errorBody,
        requestBody: {
          chat_id: chatId,
          text: options.text,
          reply_markup: options.reply_markup,
          parse_mode: 'HTML',
        },
      });
      throw new Error(`Telegram API error: ${response.statusText}${errorBody ? ` - ${JSON.stringify(errorBody)}` : ''}`);
    }

    return response.json();
  }

  async sendLocation(
    chatId: string | number,
    options: {
      latitude: number;
      longitude: number;
    }
  ) {
    const response = await fetch(`${this.baseUrl}/sendLocation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        latitude: options.latitude,
        longitude: options.longitude,
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    return response.json();
  }

  async editMessageText(options: { chat_id: string | number; message_id: number; text: string; reply_markup?: any }) {
    const response = await fetch(`${this.baseUrl}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: options.chat_id,
        message_id: options.message_id,
        text: options.text,
        reply_markup: options.reply_markup,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    return response.json();
  }

  async answerCallbackQuery(options: { callback_query_id: string; text?: string; show_alert?: boolean }) {
    const response = await fetch(`${this.baseUrl}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: options.callback_query_id,
        text: options.text,
        show_alert: options.show_alert || false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    return response.json();
  }
}
