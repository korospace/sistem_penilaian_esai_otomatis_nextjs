declare module 'sastrawijs' {
  export class Tokenizer {
    constructor();
    tokenize(text: string): string[];
  }

  export class Stemmer {
    constructor();
    stem(word: string): string;
  }
}