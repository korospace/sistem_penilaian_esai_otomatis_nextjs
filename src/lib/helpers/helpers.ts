// nextjs
import { NextResponse } from "next/server";
// external lib
import CryptoJS from "crypto-js";
import DOMPurify from "dompurify";
import { ZodError } from "zod";
import * as XLSX from "xlsx";
// types
import { DurationType, SynonymType } from "../types/ResultTypes";
// data
import synonymData from "../data/synonym.json";

export const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const DateFormating = {
  isValidDateFormat: (value: string) => {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    return regex.test(value);
  },
  getCurrentUnixTimestamp: () => {
    return Math.floor(Date.now() / 1000);
  },
  toUnixTimeStamp: (dateString: string) => {
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000);
  },
  changeDateFormat: (originalDate: string) => {
    // Split the original date into parts
    const parts = originalDate.split(/[-\/]/);
    // Extract day, month, and year from the original date
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return `${day}-${month}-${year}`;
  },
  extractDateTime: (datetime: string) => {
    const dateObj = new Date(datetime);

    // Extract date components
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(dateObj.getDate()).padStart(2, "0");

    // Extract time components
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    // Construct date and time strings
    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}`;

    // Return date and time object
    return { date, time };
  },
  getDuration: (start_date: Date, end_date: Date): DurationType => {
    // Ubah kedua tanggal menjadi milidetik
    var start_millis = start_date.getTime();
    var end_millis = end_date.getTime();

    // Hitung selisih waktu dalam milidetik
    var selisih_millis = Math.abs(end_millis - start_millis);

    // Hitung jam, menit, dan detik
    var selisih_detik = Math.floor(selisih_millis / 1000);
    var selisih_menit = Math.floor(selisih_detik / 60);
    var selisih_jam = Math.floor(selisih_menit / 60);

    // Sisa menit dan detik setelah menghitung jam
    selisih_menit %= 60;
    selisih_detik %= 60;

    return {
      hour: selisih_jam,
      minute: selisih_menit,
      second: selisih_detik,
    };
  },
};

export const HashText = {
  encrypt: (plainText: string): string => {
    const hash = CryptoJS.AES.encrypt(
      plainText,
      process.env.APP_KEY ?? ""
    ).toString();
    return hash;
  },
  decrypt: (hashText: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(hashText, process.env.APP_KEY ?? "");
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedText ? decryptedText : "";
    } catch (error) {
      console.error("Decryption error:", error);
      return "";
    }
  },
  compare: (plainText: string, hashText: string): boolean => {
    try {
      const bytes = CryptoJS.AES.decrypt(hashText, process.env.APP_KEY ?? "");
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return plainText === decryptedText;
    } catch (error) {
      console.error("Comparison decryption error:", error);
      return false;
    }
  },
};

export const createExcerpt = (content: string, limit: number) => {
  // Clean HTML and ensure safe content
  const cleanedContent = DOMPurify.sanitize(content);

  // Create a DOMParser for parsing
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanedContent, "text/html");

  // Find the first image tag
  const imageTag = doc.querySelector("img");

  if (imageTag) {
    // If there's an image in the first line, remove it and its parent
    const imageParent = imageTag.parentNode;
    imageParent?.parentNode?.removeChild(imageParent);
  }

  // Get the text content without HTML tags
  let textContent = doc.body.textContent || "";

  // Limit the excerpt by characters
  let excerpt = textContent.slice(0, limit);
  excerpt = content.length > limit ? excerpt + " ..." : excerpt;

  return excerpt;
};

export const extractDataFromExcel = async (
  fileBuffer: Buffer
): Promise<any[]> => {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  // Baca sheet pertama (index 0)
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData: any = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Buat array of json dari baris data
  const keys = jsonData[0];
  const rows = jsonData.slice(1).map((row: any[]) => {
    const obj: any = {};
    let hasValidData = false;

    keys.forEach((key: string, index: number) => {
      if (
        row[index] !== undefined &&
        row[index] !== null &&
        row[index] !== ""
      ) {
        obj[key] = row[index];
        hasValidData = true;
      }
    });

    return hasValidData ? obj : null;
  });

  // Filter out any null values from rows
  const filteredRows = rows.filter((row: any) => row !== null);

  return filteredRows;
};

export const readFileAsBuffer = async (file: File): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(Buffer.from(reader.result)); // Convert ArrayBuffer to Buffer
      } else {
        reject(new Error("Failed to read file as ArrayBuffer"));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const ResponseFormating = {
  json: (message: string, httpCode: number = 200, data: any = false) => {
    let payload: any = {
      status: httpCode >= 300 ? false : true,
      message,
    };

    if (data !== false) {
      payload.data = data;
    }

    return NextResponse.json(payload, { status: httpCode });
  },
  zodErrors: (errors: ZodError) => {
    return errors.issues.reduce((acc: any, issue) => {
      const key = issue.path[0];
      acc[key] = issue.message;
      return acc;
    }, {});
  },
};

export const cleanText = (text: string) => {
  // Menghilangkan semua tag HTML
  let cleanedText = text.replace(/<[^>]*>/g, "");
  // Menghapus spasi berturut-turut dengan satu spasi
  cleanedText = cleanedText.replace(/\s+/g, " ");
  // Menghapus spasi di awal dan akhir
  cleanedText = cleanedText.trim();
  // Mengubah teks menjadi huruf kecil
  cleanedText = cleanedText.toLowerCase();
  // Menghapus semua tanda baca
  cleanedText = cleanedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  return cleanedText;
};

export const getSynonymsByWord = (word: string): string[] | null => {
  const entry = synonymData.find(
    (item: SynonymType) => item.word.toLowerCase() === word.toLowerCase()
  );

  if (entry) {
    return entry.synonym.split(",").map((s) => s.trim());
  } else {
    return null;
  }
};

export const pathCheck = (path: string, pathList: string[]): boolean => {
  return pathList.some((p) => {
    const regex = new RegExp(`^${p}(\/.*)?$`);

    return regex.test(path);
  });
};

export const getPathName = (): string => {
  const fullPath = window.location.pathname;
  const pathname = fullPath.replace(baseUrl, "");

  return pathname;
};
