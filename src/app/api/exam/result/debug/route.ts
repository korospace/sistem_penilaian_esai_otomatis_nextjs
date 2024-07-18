// nextjs
import { NextRequest } from "next/server";
// helpers
import { ResponseFormating } from "@/lib/helpers/helpers";
import { EssayCorrection } from "@/lib/helpers/essay_correction";

/**
 * Get Result
 * -------------------------
 */
export async function GET(request: NextRequest) {
  const answer = "Ibu memasak di dapur";
  const answer_key =
    "Pembelajaran ini diharapkan mereka memiliki perhatian, kepekaan dan menghargai Bahasa dan sastra yang memperkaya kerohanian dan mentalitas";

  // const ak_cleaned = EssayCorrection.cleanText(answer_key);
  // const a_cleaned = EssayCorrection.cleanText(answer);

  const ak_stemmed = EssayCorrection.stemmingSastrawi(answer_key);
  const a_stemmed = EssayCorrection.stemmingSastrawi(answer);

  const ak_stopword = EssayCorrection.stopwordRemoval(ak_stemmed.str ?? "");
  const a_stopword = EssayCorrection.stopwordRemoval(a_stemmed.str ?? "");

  const a_normalize = EssayCorrection.synonymReplacement(
    ak_stopword.str ?? "",
    a_stopword.str ?? ""
  );

  const ak_ngram = EssayCorrection.nGram(ak_stopword.arr ?? [], 2);
  const a_ngram = EssayCorrection.nGram(a_normalize.arr ?? [], 2);

  // const lev = await EssayCorrection.lev(answer, answer_key);

  // response api
  return ResponseFormating.json("this is debug", 200, {
    // ak_cleaned,
    // ak_stemmed,
    // a_cleaned,
    ak_stopword,
    a_stemmed,
    a_stopword,
    a_normalize,
    ak_ngram,
    a_ngram,
    // lev,
  });
}
