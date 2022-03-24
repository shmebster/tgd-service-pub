import { Logger } from '@nestjs/common';

export class WrongAnswerReceivedEvent {
  private readonly logger = new Logger(WrongAnswerReceivedEvent.name);
  constructor(public tId: number, public validAnswer: string) {
    this.logger.verbose(`raised by ${tId}`);
  }
}
