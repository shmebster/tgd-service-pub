export class ScoreChangedEvent {
  constructor(public telegramId: number, public newScore: number) {
  }
}
