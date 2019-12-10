class Dice {
  private randomNumber(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low)) + low;
  }

  public roll(
    count: number,
    faces: number,
    dropHigh?: number,
    dropLow?: number
  ): number[] {
    const results: number[] = [];
    for(let i = 0; i < count; i++) {
      results.push(this.randomNumber(1, faces));
    }
    return results;
  }
}

export default Dice;
