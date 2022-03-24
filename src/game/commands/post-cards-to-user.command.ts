export class PostCardsToUserCommand {
  constructor(
    public telegramId: number,
    public chatId: number,
    public cards: string[],
  ) {}
}
