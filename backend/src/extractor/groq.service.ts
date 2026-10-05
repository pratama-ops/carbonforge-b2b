import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('GROQ_API_KEY');
    this.baseUrl =
      this.configService.get<string>(
        'GROQ_API_BASE_URL',
        'https://api.groq.com/openai/v1',
      );
    this.model = this.configService.get<string>(
      'GROQ_MODEL',
      'llama-3.3-70b-versatile',
    );
  }

  /**
   * Sends a chat completion request to Groq API with JSON response format.
   */
  async chatCompletion(
    messages: GroqMessage[],
    temperature = 0.1,
  ): Promise<string> {
    const url = `${this.baseUrl}/chat/completions`;

    const payload = {
      model: this.model,
      messages,
      temperature,
      response_format: { type: 'json_object' },
      max_tokens: 4096,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `Groq API error: ${response.status} - ${errorBody}`,
        );
        throw new ServiceUnavailableException(
          'AI service is temporarily unavailable. Please try again later.',
        );
      }

      const data =
        (await response.json()) as GroqChatCompletionResponse;

      if (!data.choices?.[0]?.message?.content) {
        this.logger.error('Groq API returned empty response');
        throw new ServiceUnavailableException(
          'AI service returned an invalid response.',
        );
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }

      this.logger.error(
        `Failed to connect to Groq API: ${error.message}`,
        error.stack,
      );
      throw new ServiceUnavailableException(
        'Unable to connect to AI service. Please try again later.',
      );
    }
  }
}
