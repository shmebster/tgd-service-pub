import { Logger } from '@nestjs/common';

export class ValidAnswerReceivedEvent {
  private readonly logger = new Logger(ValidAnswerReceivedEvent.name);
  constructor(public tId: number, public validAnswer: string) {
    this.logger.verbose(`raised by: ${this.tId}`);
  }
}
