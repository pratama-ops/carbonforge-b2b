import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(private config: ConfigService) {}

  async extractLandData(
    fileBase64: string,
    fileType: string,
  ): Promise<{
    extractedData: Record<string, any>;
    confidence: number;
    processingTimeMs: number;
  }> {
    const startTime = Date.now();
    const apiKey = this.config.get<string>('GROQ_API_KEY');

    if (!apiKey) {
      this.logger.warn('GROQ_API_KEY not set, using mock extraction');
      return this.mockExtraction(startTime);
    }

    try {
      const prompt = this.buildExtractionPrompt();

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.2-90b-vision-preview',
          messages: [
            {
              role: 'system',
              content: prompt,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract land certificate data from this document.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${fileType === 'PDF' ? 'application/pdf' : 'image/jpeg'};base64,${fileBase64}`,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 1024,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content ?? '{}';
      const extractedData = JSON.parse(content);

      const processingTimeMs = Date.now() - startTime;

      return {
        extractedData: {
          certificateNumber: extractedData.certificateNumber ?? '',
          ownerName: extractedData.ownerName ?? '',
          gpsCoordinates: {
            lat: extractedData.gpsCoordinates?.lat ?? '',
            lng: extractedData.gpsCoordinates?.lng ?? '',
          },
          areaHectares: extractedData.areaHectares ?? '',
          estimatedCarbonPotential: extractedData.estimatedCarbonPotential ?? '',
          vegetationType: extractedData.vegetationType ?? '',
          additionalNotes: extractedData.additionalNotes ?? '',
        },
        confidence: extractedData.confidence ?? 0.85,
        processingTimeMs,
      };
    } catch (error) {
      this.logger.error(`Groq extraction failed: ${error.message}`);
      // Fallback to mock extraction
      return this.mockExtraction(startTime);
    }
  }

  private buildExtractionPrompt(): string {
    return `You are an AI assistant specialized in extracting data from land certificates and carbon credit documents.

Extract the following fields from the document and return them in JSON format:
- certificateNumber: The official certificate or land title number
- ownerName: The name of the land owner or certificate holder
- gpsCoordinates: An object with "lat" and "lng" fields for GPS coordinates
- areaHectares: The land area in hectares (as a string)
- estimatedCarbonPotential: The estimated carbon sequestration potential (as a string)
- vegetationType: The type of vegetation (e.g., "Mangrove", "Tropical Rainforest", "Peatland")
- additionalNotes: Any additional relevant information
- confidence: A number between 0 and 1 indicating extraction confidence

Return ONLY valid JSON with these fields. If a field cannot be found, use an empty string.`;
  }

  private mockExtraction(startTime: number) {
    const processingTimeMs = Date.now() - startTime;

    return {
      extractedData: {
        certificateNumber: `CERT-${Date.now().toString(36).toUpperCase()}`,
        ownerName: 'Mock Owner Name',
        gpsCoordinates: {
          lat: '-6.2088',
          lng: '106.8456',
        },
        areaHectares: '150.5',
        estimatedCarbonPotential: '2500',
        vegetationType: 'Mangrove',
        additionalNotes: 'Mock extraction result for testing purposes',
      },
      confidence: 0.75,
      processingTimeMs,
    };
  }
}
