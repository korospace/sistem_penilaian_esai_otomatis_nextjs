// prisma
import { prisma } from "@/lib/db/init";
// external lib
// import { StemmerId, WordTokenizer } from "natural";
import { removeStopwords, ind } from "stopword";
import { Stemmer, Tokenizer } from "sastrawijs";
// internal lib
import fs from "fs";
import path from "path";
// types
import {
  LevType,
  PreProcessingType,
  TrainingDetailType,
  TrainingType,
} from "@/lib/types/ResultTypes";
import { TrainingInputType, TrainingInputV2Type } from "../types/InputTypes";
// helpers
import { cleanText, getSynonymsByWord } from "./helpers";
// data
import synonymData from "../data/synonym.json";

export const EssayCorrection = {
  cleanText: (text: string) => {
    return cleanText(text);
  },
  // stemmingNatural: (text: string): PreProcessingType => {
  //   const naturalTokenizer = new WordTokenizer();
  //   const tokens = naturalTokenizer.tokenize(text);

  //   const stemmedTokens = tokens.map((token) => StemmerId.stem(token));

  //   return {
  //     str: stemmedTokens.join(" "),
  //     arr: stemmedTokens,
  //   };
  // },
  stemmingSastrawi: (text: string): PreProcessingType => {
    const sastrawiStemmer = new Stemmer();
    const sastrawiTokenizer = new Tokenizer();
    const stemmed: string[] = [];

    const words = sastrawiTokenizer.tokenize(text);

    for (const word of text.split(" ")) {
      stemmed.push(sastrawiStemmer.stem(word));
    }

    return {
      str: stemmed.join(" "),
      arr: stemmed,
    };
  },
  readStopwordsFromFile: (filePath: string): string[] => {
    try {
      const stopwordsFilePath = path.join(process.cwd(), filePath);

      const data = fs.readFileSync(stopwordsFilePath, "utf8");

      const lines = data.split(/\r?\n/);

      const stopwords = lines
        .filter((line) => line.trim() && !line.trim().startsWith("#"))
        .map((line) => line.trim());

      return stopwords;
    } catch (err) {
      console.error("Error reading file:", err);
      return [];
    }
  },
  stopwordRemoval: (text: string): PreProcessingType => {
    // const stopwords = ind
    const stopwords = EssayCorrection.readStopwordsFromFile(
      "src/lib/data/id.stopwords.02.01.2016.txt"
    );

    const removedTokens = removeStopwords(text.split(" "), stopwords);

    return {
      str: removedTokens.join(" "),
      arr: removedTokens,
    };
  },
  nGram: (tokens: string[], n: number): PreProcessingType => {
    const nGrams = [];
    for (let i = 0; i < tokens.length - n + 1; i++) {
      nGrams.push(tokens.slice(i, i + n).join(""));
    }

    return {
      str: nGrams.join(" "),
      arr: nGrams,
    };
  },
  areSynonyms: async (word1: string, word2: string): Promise<boolean> => {
    if (word1 === word2) return true;

    const synonym = getSynonymsByWord(word1);

    if (synonym == null) {
      return false;
    } else {
      return synonym.includes(word2);
    }
  },
  synonymReplacement: (
    answerKey: string,
    studentAnswer: string
  ): PreProcessingType => {
    const synonymMap = new Map();

    // Populate synonym map with word as key and list of synonyms as value
    synonymData.forEach((entry) => {
      const synonyms = entry.synonym.split(",").map((s) => s.trim());
      synonymMap.set(entry.word, synonyms);

      synonyms.forEach((syn) => {
        if (!synonymMap.has(syn)) {
          synonymMap.set(syn, [
            entry.word,
            ...synonyms.filter((s) => s !== syn),
          ]);
        } else {
          synonymMap.get(syn).push(entry.word);
          synonymMap
            .get(syn)
            .push(
              ...synonyms.filter(
                (s) => s !== syn && !synonymMap.get(syn).includes(s)
              )
            );
        }
      });
    });

    const keyWords = new Set(answerKey.split(" "));
    const normalizedWords = studentAnswer.split(" ").map((word) => {
      for (const [key, synonyms] of synonymMap.entries()) {
        if (synonyms.includes(word) && keyWords.has(key)) {
          return key;
        }
      }
      return word;
    });

    return {
      str: normalizedWords.join(" "),
      arr: normalizedWords,
    };
  },
  lev: async (typo: string, bener: string): Promise<LevType> => {
    // const typo1 = "#" + typo;
    // const bener1 = "#" + bener;
    const typo1 = typo;
    const bener1 = bener;
    const matriks = Array.from({ length: typo1.length }, () =>
      Array.from({ length: bener1.length }, () => 0)
    );

    for (let i = 0; i < typo1.length; i++) {
      for (let j = 0; j < bener1.length; j++) {
        if (Math.min(i, j) === 0) {
          matriks[i][j] = Math.max(i, j);
        } else {
          let a = matriks[i - 1][j] + 1;
          let b = matriks[i][j - 1] + 1;
          let c = matriks[i - 1][j - 1];

          if (typo1[i] !== bener1[j]) {
            c += 1;
          }
          matriks[i][j] = Math.min(a, b, c);
        }
      }
    }

    const distance = matriks[typo1.length - 1][bener1.length - 1];
    const distanceLength = Math.max(typo1.length - 1, bener1.length - 1);

    return {
      distance: distance,
      distanceLength: distanceLength,
      levValue: distance / distanceLength,
      string1: typo1,
      string2: bener1,
      matriks,
    };
  },
  simMatrix: async (arr1: string[], arr2: string[]): Promise<number[][]> => {
    const similar: number[][] = Array.from({ length: arr1.length }, () =>
      Array.from({ length: arr2.length }, () => 0)
    );

    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        const lev = await EssayCorrection.lev(arr1[i], arr2[j]);
        similar[i][j] = lev.levValue;
      }
    }

    return similar;
  },
  maxSim: (Matrix: number[][]) => {
    const sim = [];
    for (const i of Matrix) {
      sim.push(Math.min(...i));
    }
    return sim;
  },
  resultLev: (sim: any): number => {
    let sum = 0;
    for (const i of sim) {
      sum += i;
    }
    return sum / sim.length;
  },
  resultLevPercentage: (sim: any): number => {
    let sum = 0;

    for (const i of sim) {
      sum += i;
    }

    const result = 100 - (Number(sum.toFixed(2)) / sim.length) * 100;

    return Number(result.toFixed(0));
  },
  grading: (percentage: number): string => {
    if (percentage >= 85) {
      return "A";
    } else if (percentage >= 80 && percentage < 85) {
      return "A-";
    } else if (percentage >= 75 && percentage < 80) {
      return "B+";
    } else if (percentage >= 70 && percentage < 75) {
      return "B";
    } else if (percentage >= 65 && percentage < 70) {
      return "B-";
    } else if (percentage >= 60 && percentage < 65) {
      return "C";
    } else if (percentage >= 45 && percentage < 60) {
      return "D";
    } else {
      return "E";
    }
  },
  trainingData: async (data: TrainingInputType[]): Promise<TrainingType> => {
    let EC = EssayCorrection;
    let wrong = 0;
    let correct = 0;
    let accuracy = 0;
    let averageScore = 0;
    let trainingDetails: TrainingDetailType[] = [];

    // looping question & answer
    for (let iteration = 0; iteration < data.length; iteration++) {
      const nGramValue = 2;
      const row = data[iteration];

      // -- pre process
      let ak_cleaned = EC.cleanText(row.answer_key);
      let ak_stemmed = EC.stemmingSastrawi(ak_cleaned);
      let ak_stopword = EC.stopwordRemoval(ak_stemmed.str ?? "");
      let ak_normalize = EC.synonymReplacement(
        ak_stopword.str ?? "",
        ak_stopword.str ?? ""
      );
      let ak_ngram = EC.nGram(ak_normalize.arr ?? [], nGramValue);
      // -- -- -- --
      let a_cleaned = EC.cleanText(row.answer);
      let a_stemmed = EC.stemmingSastrawi(a_cleaned);
      let a_stopword = EC.stopwordRemoval(a_stemmed.str ?? "");
      let a_normalize = EC.synonymReplacement(
        ak_normalize.str ?? "",
        a_stopword.str ?? ""
      );
      let a_ngram = EC.nGram(a_normalize.arr ?? [], nGramValue);

      // -- similarity matrix
      const similarityMatrix = await EC.simMatrix(
        ak_ngram.arr ?? [],
        a_ngram.arr ?? []
      );

      // const similarityMatrix = await EC.simMatrix(
      //   ak_stopword.arr ?? [],
      //   a_stopword.arr ?? []
      // );

      // const similarityMatrix = await EC.simMatrix(
      //   ["rohaniah mentalitas"] ?? [],
      //   ["kaya rohaniah"] ?? []
      // );

      // -- max similarity between each word
      const maxSimilarity = EC.maxSim(similarityMatrix);

      // -- Hitung nilai kesamaan rata-rata
      const resultLev = EC.resultLev(maxSimilarity);
      const resultLevPercentage = EC.resultLevPercentage(maxSimilarity);
      const resultLevGrade = EC.grading(resultLevPercentage);

      // -- expectation counter
      if (row.expectation_grade) {
        if (row.expectation_grade === resultLevGrade) {
          correct = correct + 1;
        } else {
          wrong = wrong + 1;
        }

        // -- accuracy
        accuracy = (correct / (iteration + 1)) * 100;
      }

      // -- average score
      averageScore =
        (averageScore * iteration + resultLevPercentage) / (iteration + 1);

      const trainingData = {
        grade: {
          score: resultLevPercentage,
          grade: resultLevGrade,
        },
        similiarity_matrix: JSON.stringify(similarityMatrix),
        max_simmatrix: JSON.stringify(maxSimilarity),
        answer: {
          raw_value: row.answer,
          cleaned: a_cleaned.split(" ").join(" | "),
          stemmed: a_stemmed.arr?.join(" | "),
          stopword_removed: a_stopword.arr?.join(" | "),
          synonym_replaced: a_normalize.arr?.join(" | "),
          n_gram: a_ngram.arr?.join(" | "),
        },
        answer_key: {
          raw_value: row.answer_key,
          cleaned: ak_cleaned.split(" ").join(" | "),
          stemmed: ak_stemmed.arr?.join(" | "),
          stopword_removed: ak_stopword.arr?.join(" | "),
          synonym_replaced: ak_normalize.arr?.join(" | "),
          n_gram: ak_ngram.arr?.join(" | "),
        },
      };

      trainingDetails.push(trainingData);
    }

    return {
      wrong: wrong,
      correct: correct,
      accuracy: accuracy,
      grade: {
        score: averageScore,
        grade: EC.grading(averageScore),
      },
      details: trainingDetails,
    };
  },
  trainingDataV2: async (
    data: TrainingInputV2Type[]
  ): Promise<TrainingType> => {
    let EC = EssayCorrection;
    let averageScore = 0;
    let trainingDetails: TrainingDetailType[] = [];

    // looping question & answer
    for (let iteration = 0; iteration < data.length; iteration++) {
      const row = data[iteration];

      // -- pre process
      let ak_cleaned = row.answer_key.cleaned;
      let ak_stemmed = row.answer_key.stemmed;
      let ak_stopword = row.answer_key.stopword_removed;
      let ak_normalize = row.answer_key.stopword_removed;
      let ak_ngram = row.answer_key.n_gram;
      // -- -- -- --
      let a_cleaned = row.answer.cleaned;
      let a_stemmed = row.answer.stemmed;
      let a_stopword = row.answer.stopword_removed;
      let a_normalize = row.answer.synonym_replaced;
      let a_ngram = row.answer.n_gram;

      let resultLevPercentage = 0;
      let resultLevGrade = "E";

      if (row.answer.raw_value) {
        // -- max similarity between each word
        const maxSimilarity = JSON.parse(row.max_simmatrix);
        // -- Hitung nilai kesamaan rata-rata
        const resultLev = EC.resultLev(maxSimilarity);
        resultLevPercentage = EC.resultLevPercentage(maxSimilarity);
        resultLevGrade = EC.grading(resultLevPercentage);
      }

      // -- average score
      averageScore =
        (averageScore * iteration + resultLevPercentage) / (iteration + 1);

      const trainingData = {
        grade: {
          score: resultLevPercentage,
          grade: resultLevGrade,
        },
        similiarity_matrix: row.similiarity_matrix,
        max_simmatrix: row.max_simmatrix,
        answer: {
          raw_value: row.answer.raw_value,
          cleaned: a_cleaned,
          stemmed: a_stemmed,
          stopword_removed: a_stopword,
          synonym_replaced: a_normalize,
          n_gram: a_ngram,
        },
        answer_key: {
          raw_value: row.answer_key.raw_value,
          cleaned: ak_cleaned,
          stemmed: ak_stemmed,
          stopword_removed: ak_stopword,
          synonym_replaced: ak_normalize,
          n_gram: ak_ngram,
        },
      };

      trainingDetails.push(trainingData);
    }

    return {
      grade: {
        score: averageScore,
        grade: EC.grading(averageScore),
      },
      details: trainingDetails,
    };
  },
};
