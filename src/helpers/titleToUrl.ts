const titleToSlug = (title: string) => {
    const url = title.replaceAll(
      /[,!?*ışçöüğİŞÇÖÜĞ'’éèêàâëïîôûçœùÿÉÈËÎÔÛÀÂÙŸ ẠẢÀÃÂẬẮẶẰẴẸẼẾỀỂỄỊỌÕỒỐỚỢỦŨƯỨỰỲỴỶỸ/ .]/g,
      (change: string) => differentLetters[change]
    );
  
    return url.toLocaleLowerCase();
  };
  
  const differentLetters: Record<string, string> = {
    ",": "",
    "!": "",
    "?": "",
    "*": "",
    ı: "i",
    ş: "s",
    ç: "c",
    ö: "o",
    ü: "u",
    ğ: "g",
    İ: "i",
    Ş: "s",
    Ç: "c",
    Ö: "o",
    Ü: "u",
    Ğ: "g",
    é: "e",
    É: "e",
    " ": "-",
    ".": "",
    "'": "",
    "’": "",
    è: "e",
    È: "e",
    ë: "e",
    Ë: "e",
    ê: "e",
    Ê: "e",
    à: "a",
    À: "a",
    â: "a",
    Â: "a",
    ï: "i",
    Ï: "i",
    î: "i",
    Î: "i",
    ô: "o",
    Ô: "o",
    û: "u",
    Û: "u",
    œ: "ae",
    Œ: "ae",
    ù: "u",
    Ù: "u",
    ÿ: "y",
    Ÿ: "y",
    ạ: "a",
    Ả: "a",
    ã: "a",
    Ă: "a",
    Ắ: "a",
    Ặ: "a",
    Ằ: "a",
    Ẵ: "a",
    ẹ: "e",
    ẽ: "e",
    ế: "e",
    ề: "e",
    Ể: "e",
    Ễ: "e",
    ỉ: "i",
    ị: "i",
    ọ: "o",
    õ: "o",
    ồ: "o",
    ố: "o",
    ớ: "o",
    ợ: "o",
    ủ: "u",
    ũ: "u",
    ư: "u",
    Ứ: "u",
    Ự: "u",
    Ỳ: "y",
    Ỵ: "y",
    Ỷ: "y",
    Ỹ: "y",
    Ạ: "a",
    Ã: "a",
    Ậ: "a",
    Ẹ: "e",
    Ẽ: "e",
    Ế: "e",
    Ề: "e",
    Ị: "i",
    Ọ: "o",
    Õ: "o",
    Ồ: "o",
    Ố: "o",
    Ớ: "o",
    Ợ: "o",
    Ủ: "u",
    Ũ: "u",
    Ư: "u",
    "/": "",
  };
  
  export default titleToSlug