import { Body, Controller, Get, Header, NotFoundException, Post, Query, StreamableFile } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { TtsRequestDto, TtsRequestWithVars } from './models/TtsRequestDto';
import { TGD_Config } from '../../app.config';
import { invalidPrefixDict } from './dicts/invalid-prefix.dict';
import { validPrefixDict } from './dicts/valid-prefix.dict';
import * as translit from 'latin-to-cyrillic';
@Controller('voice')
export class VoiceController {
  constructor(private voiceService: VoiceService) {}


  @Get('ssml')
  @Header('content-type', 'audio/opus')
  @Header('content-disposition', 'inline')
  async textToSpeechSSML(@Query() dto: TtsRequestDto) {
    if (TGD_Config.enableVoice) {
      return new StreamableFile(await this.voiceService.textToFile(dto, true));
    } else {
      return new NotFoundException('Voice disabled');
    }
  }

  @Get('tts')
  @Header('content-type', 'audio/opus')
  @Header('content-disposition', 'inline')
  async getText(@Query() dto: TtsRequestDto) {
    dto.text = translit(dto.text);
    if (TGD_Config.enableVoice) {
      return new StreamableFile(await this.voiceService.textToFile(dto));
    } else {
      return new NotFoundException('Voice disabled');
    }
  }
  @Get('announce-valid')
  @Header('content-type', 'audio/opus')
  @Header('content-disposition', 'inline')
  async announceValid(@Query() dto: TtsRequestWithVars) {
    if (TGD_Config.enableVoice) {
      const vars = JSON.parse(dto.vars);
      dto.text = this.voiceService.buildTemplate(dto, vars, validPrefixDict);
      return new StreamableFile(await this.voiceService.textToFile(dto));
    } else {
      return new NotFoundException('Voice disabled');
    }
  }

  @Get('announce-invalid')
  @Header('content-type', 'audio/opus')
  @Header('content-disposition', 'inline')
  async announceInvalid(@Query() dto: TtsRequestWithVars) {
    if (TGD_Config.enableVoice) {
      const vars = JSON.parse(dto.vars);
      dto.text = this.voiceService.buildTemplate(dto, vars, invalidPrefixDict);
      return new StreamableFile(await this.voiceService.textToFile(dto));
    } else {
      return new NotFoundException('Voice disabled');
    }
  }
}
