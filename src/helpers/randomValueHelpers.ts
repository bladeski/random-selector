export default class RandomHelpers {
  public static getMultipleRandomSelection<T>(list: T[], count = 1): T[] {
    const shuffledList = this.shuffleArray(list);
    return shuffledList.slice(0, count);
  }

  public static getRandomArbitraryNumber(min = 0, max = 1): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public static getRandomSelection<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)];
  }

  public static shuffleArray<T>(list: T[]): T[] {
    const array = [...list];
    // Uses Fisher Yates shuffle - see https://javascript.info/array-methods#shuffle-an-array
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];      
    }
    return array;
  }
}