export class InvalidInformationProvided extends Error{
    constructor(){
        super("Some provided information was invalid")
    }
}