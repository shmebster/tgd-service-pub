import { Logger } from '@nestjs/common';

export class CardSelectionPendingEvent {
  private readonly logger = new Logger(CardSelectionPendingEvent.name);
  constructor() {}

}
