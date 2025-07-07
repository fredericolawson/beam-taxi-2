'use server';

interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
}

interface MissileMessageOptions {
  message: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
  buttons?: InlineKeyboardButton[][];
}

export async function missile(options: MissileMessageOptions): Promise<{ success: boolean; messageId?: number; error?: string }> {
  const { message, parseMode = 'HTML', disableWebPagePreview = false, disableNotification = false, buttons } = options;

  const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  const payload = {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: parseMode,
    disable_web_page_preview: disableWebPagePreview,
    disable_notification: disableNotification,
    ...(buttons && { reply_markup: { inline_keyboard: buttons } }),
  };

  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.description || 'Failed to send message',
      };
    }

    return {
      success: true,
      messageId: data.result.message_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
