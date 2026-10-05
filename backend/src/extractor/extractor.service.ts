import {
  Injectable,
  Logger,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GroqService } from './groq.service';

export interface ExtractedCarbonData {
  companyName?: string;
  totalEmissions?: {
    value: number;
    unit: string;
  };
  emissionSources?: Array<{
    source: string;
    value: number;
    unit: string;
  }>;
  reportingPeriod?: {
    startDate?: string;
    endDate?: string;
  };
  landCoordinates?: Array<{
    latitude: number;
    longitude: number;
  }>;
  landArea?: {
    value: number;
    unit: string;
  };
  certificateId?: string;
  additionalData?: Record<string, unknown>;
}

@Injectable()
export class ExtractorService {
  private readonly logger = new Logger(ExtractorService.name);

  constructor(private readonly groqService: GroqService) {}

  /**
   * Extracts structured carbon data from document text using Groq AI.
   */
  async extractDocumentData(content: string): Promise<ExtractedCarbonData> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(content);

    try {
      const response = await this.groqService.chatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);

      return this.parseJsonResponse(response);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnprocessableEntityException
      ) {
        throw error;
      }

      this.logger.error(
        `Document extraction failed: ${error.message}`,
        error.stack,
      );
      throw new UnprocessableEntityException(
        'Failed to extract data from document. Please ensure the document contains valid carbon emission or certificate information.',
      );
    }
  }

  /**
   * Builds the system prompt for carbon data extraction.
   */
  private buildSystemPrompt(): string {
    return `You are an expert carbon emissions data extraction assistant. Your task is to extract structured data from carbon emission reports, certificates, and related documents.

You MUST respond with ONLY valid JSON (no markdown, no explanation, no additional text). The JSON should follow this schema:

{
  "companyName": "string or null",
  "totalEmissions": {
    "value": number,
    "unit": "string (e.g., tCO2e, kgCO2e, MtCO2e)"
  },
  "emissionSources": [
    {
      "source": "string (e.g., transportation, energy, agriculture)",
      "value": number,
      "unit": "string"
    }
  ],
  "reportingPeriod": {
    "startDate": "string (ISO 8601 format) or null",
    "endDate": "string (ISO 8601 format) or null"
  },
  "landCoordinates": [
    {
      "latitude": number,
      "longitude": number
    }
  ],
  "landArea": {
    "value": number,
    "unit": "string (e.g., hectares, km2, m2)"
  },
  "certificateId": "string or null",
  "additionalData": {
    "key": "value"
  }
}

Rules:
1. All numeric values must be numbers, not strings.
2. Use null for fields that cannot be found in the document.
3. For emissions, always include the unit (typically tCO2e).
4. For coordinates, use decimal degrees format.
5. Extract ALL relevant data found in the document.
6. If the document is not related to carbon emissions or certificates, return an empty object {}.`;
  }

  /**
   * Builds the user prompt with the document content.
   */
  private buildUserPrompt(content: string): string {
    return `Please extract the following information from this document:

"""
${content}
"""

Return the extracted data as JSON.`;
  }

  /**
   * Parses and validates the JSON response from the AI model.
   */
  private parseJsonResponse(response: string): ExtractedCarbonData {
    let parsed: unknown;

    try {
      parsed = JSON.parse(response);
    } catch {
      // Attempt to extract JSON from markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[1]);
        } catch {
          throw new BadRequestException(
            'AI response could not be parsed as valid JSON.',
          );
        }
      } else {
        throw new BadRequestException(
          'AI response could not be parsed as valid JSON.',
        );
      }
    }

    if (typeof parsed !== 'object' || parsed === null) {
      throw new BadRequestException('AI response is not a valid JSON object.');
    }

    return parsed as ExtractedCarbonData;
  }
}
