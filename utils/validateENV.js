import {cleanEnv} from "envalid";
import {str, port} from "envalid/dist/validators"

export default cleanEnv(process.env, {

    HOST: str(),
    USER : str(),
    DATABASE: str(),
    PORT: port(),
    ACTIVATION_SECRET: str(),
    SMPT_HOST: str(),
    SMPT_PORT: port(),
    SMPT_SERVICE: str(),
    SMPT_MAIL: str(),
    SMPT_PASSWORD: str(),
    JWT_SECRET: str(),
    JWT_EXPIRES_IN: str(),
})