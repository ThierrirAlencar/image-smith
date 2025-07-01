export function GenValidationCode() {
    const partes = [];
    
    for (let i = 0; i < 3; i++) {
      // Gera um número de 3 algarismos (entre 100 e 999)
      const parte = Math.floor(100 + Math.random() * 900);
      partes.push(parte);
    }
    
    // Junta as partes com um separador, como por exemplo o '-'
    const codigo = partes.join('-');
    
    return codigo;
}

export function Gen5digitsValidationCode(){
    //Gera um número de 5 algarismos (entre 100 e 999)
    const codigo = Math.floor(10000 + Math.random() * 99999);
    return codigo;
}