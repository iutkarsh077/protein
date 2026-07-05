class Errorhandler{
    constructor(error, statusCode){
        this.error = error;
        this.statusCode = statusCode
    }

    ErrorMessage(){
        const customError = {
            error: this.error,
            statusCode: this.statusCode
        }
        return customError
    }
}

export default Errorhandler