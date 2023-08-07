import SteamUser from "steam-user";
import * as InquirerPrompt from "@inquirer/prompts";
import InquirerPassword from "@inquirer/password";

export class SteamIdle {
    public steamUser: SteamUser;

    constructor() {
        this.steamUser = this._createSteamUser();
        this._startListeners()
    }

    public async start() {

        /**
         * 
         * Inputs com credenciais
         * 
         */
        const accountNameAnswer = await InquirerPrompt.input({
            message: "Account Name:",
            default: "",
        });
        const passwordAnswer = await InquirerPassword({
            message: "Password:",
            mask: true,
        });
        // const steamGuardAnswer = await InquirerPrompt.input({
        //     message: "Steam Guard:",
        //     default: "",
        // });

        /**
         * 
         * Login
         * 
         */
        this.steamUser.logOn({
            accountName: accountNameAnswer,
            password: passwordAnswer,
            // twoFactorCode: steamGuardAnswer,
            autoRelogin: true,
            rememberPassword: true,
        });

    }

    private _createSteamUser() {
        return new SteamUser({
            autoRelogin: true
        });
    }

    /**
     * 
     * Inicia os listeners do steam-user
     * 
     */
    private _startListeners() {
        // ao fazer login, muda o status do perfil para "online"
        this.steamUser.once("loggedOn", () => {
            this.steamUser.setPersona(SteamUser.EPersonaState.Online);
        });

        // pega todos os erros do steam-user
        this.steamUser.once("error", (err) => {
            console.error('Ocorreu um erro:', err);
        });

        // ao fazer login, pode ser solicitado o código do steam guard, aqui setamos ele na aplicação
        this.steamUser.once("steamGuard", async (domain, callback) => {
            const steamGuardAnswer = await InquirerPrompt.input({
                message: "Steam Guard:",
                default: "",
            });

            callback(steamGuardAnswer)
        })
    }
}
