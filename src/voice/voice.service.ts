import { Injectable, Logger } from '@nestjs/common';
import { TtsRequestDto, TtsRequestWithVars } from './models/TtsRequestDto';
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable, tap } from 'rxjs';
import * as querystring from 'querystring';
import { AxiosRequestConfig } from 'axios';
import * as translit from 'latin-to-cyrillic';
import { TGD_Config } from 'app.config';
@Injectable()
export class VoiceService {
  private apiUrl = 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize';
  private apiKey = TGD_Config.voiceToken;
  private readonly logger = new Logger(VoiceService.name);
  constructor(private httpService: HttpService) {}

  buildTemplate(
    req: TtsRequestWithVars,
    vars: { [index: string]: string },
    templates: string[],
  ) {
    this.logger.verbose(JSON.stringify(req));
    this.logger.verbose(`Building template for ${req.text}`);
    let template = templates[Math.floor(Math.random() * templates.length)];
    for (const key in vars) {
      template = template.replace(`%${key}%`, vars[key]);
    }
    this.logger.verbose(`Result is: ${template}`);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    
    template = translit(template);
    return template;
  }

  textToFile(dto: TtsRequestDto, useSSML = false): Promise<Buffer> {
    this.logger.log(`Playing ${JSON.stringify(dto)}`);
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Api-Key ${this.apiKey}`,
      },
      responseType: 'arraybuffer',
    };
    const params = {
      text: dto.text,
      speed: 1.1,
      voice: TGD_Config.voice,
      lang: 'ru-RU',
      ssml: dto.text,
    };
    if (useSSML) {
      delete params.text;
    } else {
      delete params.ssml;
    }
    return this.httpService
      .post(this.apiUrl, querystring.stringify(params), config)
      .pipe(
        catchError((e) => {
          throw e;
        }),
        map((r) => {
          return r.data;
        }),
      )
      .toPromise();
  }
}
