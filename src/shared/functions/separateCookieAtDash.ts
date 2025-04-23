export function splitStringAtDash(inputString:string) {
    if (typeof inputString !== "string") {
      throw new Error("O argumento deve ser uma string.");
    }
  
    // Verifica se há um "-" na string
    const dashIndex = inputString.indexOf("-");
    if (dashIndex === -1) {
      return [inputString]; // Retorna a string como está, se não houver "-"
    }
  
    // Divide a string ao meio no primeiro "-"
    const firstPart = inputString.slice(0, dashIndex);
    const secondPart = inputString.slice(dashIndex + 1);
  
    //First part = email second part =code
    return [firstPart, secondPart];
}