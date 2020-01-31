import * as Mocha from "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const expect = chai.expect;
chai.use(chaiAsPromised);
import { AuthorizationCodeModule } from "../../../src/app/module/AuthorizationCodeModule";
import { TEST_CONFIG, TEST_URIS, RANDOM_TEST_GUID } from "../../utils/StringConstants";
import { AuthModule } from "../../../src/app/module/AuthModule";
import { AuthenticationParameters } from "../../../src/request/AuthenticationParameters";
import { ClientConfigurationError } from "../../../src/error/ClientConfigurationError";
import { LogLevel, PkceCodes, NetworkRequestOptions } from "../../../src";

describe("AuthorizationCodeModule.ts Class Unit Tests", () => {

    const testLoggerCallback = (level: LogLevel, message: string, containsPii: boolean): void => {
        if (containsPii) {
            console.log(`Log level: ${level} Message: ${message}`);
        }
    }

    let store = {};

    let authModule = new AuthorizationCodeModule({
        auth: {
            clientId: TEST_CONFIG.MSAL_CLIENT_ID,
            tmp_clientSecret: TEST_CONFIG.MSAL_CLIENT_SECRET,
            authority: TEST_CONFIG.validAuthority,
            redirectUri: TEST_URIS.TEST_REDIR_URI,
            postLogoutRedirectUri: TEST_URIS.TEST_LOGOUT_URI
        },
        storageInterface: {
            setItem(key: string, value: string): void {
                store[key] = value;
            },
            getItem(key: string): string {
                return store[key];
            },
            removeItem(key: string): void {
                delete store[key];
            },
            containsKey(key: string): boolean {
                return !!store[key];
            },
            getKeys(): string[] {
                return Object.keys(store);
            },
            clear(): void {
                store = {};
            }
        },
        networkInterface: {
            sendGetRequestAsync<T>(url: string, options?: NetworkRequestOptions): T {
                return null;
            },
            sendPostRequestAsync<T>(url: string, options?: NetworkRequestOptions): T {
                return null;
            }
        },
        cryptoInterface: {
            createNewGuid(): string {
                return RANDOM_TEST_GUID;
            },
            base64Decode(input: string): string {
                return input;
            },
            base64Encode(input: string): string {
                return input;
            },
            async generatePkceCodes(): Promise<PkceCodes> {
                return {
                    challenge: TEST_CONFIG.TEST_CHALLENGE,
                    verifier: TEST_CONFIG.TEST_VERIFIER
                }
            }
        },
        loggerOptions: {
            loggerCallback: testLoggerCallback
        }
    });
    const emptyRequest: AuthenticationParameters = {};

    describe("Constructor", () => {

        it("creates an AuthorizationCodeModule that extends the AuthModule", () => {
            expect(authModule).to.be.not.null;
            expect(authModule instanceof AuthorizationCodeModule).to.be.true;
            expect(authModule instanceof AuthModule).to.be.true;
        });
    });

    describe("Login Code Url Creation", () => {

        it("throws not implemented error", async () => {
            await expect(authModule.createLoginUrl(emptyRequest)).to.be.rejected;
        });
    });

    describe("Acquire Token Code Url Creation", () => {

        it("throws not implemented error", async () => {
            await expect(authModule.createAcquireTokenUrl(emptyRequest)).to.be.rejected;
        });
    });

    describe("Token Acquisition", () => {

        it("throws not implemented error", async () => {
            // await expect(authModule.acquireToken(emptyRequest)).to.be.rejected;
        });
    });

    describe("Getters and setters", () => {

        let redirectUriFunc = () => {
            return TEST_URIS.TEST_REDIR_URI;
        };

        let postLogoutRedirectUriFunc = () => {
            return TEST_URIS.TEST_LOGOUT_URI;
        };

        let authModule_functionRedirectUris = new AuthorizationCodeModule({
            auth: {
                clientId: TEST_CONFIG.MSAL_CLIENT_ID,
                tmp_clientSecret: TEST_CONFIG.MSAL_CLIENT_SECRET,
                authority: TEST_CONFIG.validAuthority,
                redirectUri: redirectUriFunc,
                postLogoutRedirectUri: postLogoutRedirectUriFunc
            },
            storageInterface: null,
            networkInterface: null,
            cryptoInterface: null,
            loggerOptions: {
                loggerCallback: testLoggerCallback
            }
        });

        let authModule_noRedirectUris = new AuthorizationCodeModule({
            auth: {
                clientId: TEST_CONFIG.MSAL_CLIENT_ID,
                tmp_clientSecret: TEST_CONFIG.MSAL_CLIENT_SECRET,
                authority: TEST_CONFIG.validAuthority
            },
            storageInterface: null,
            networkInterface: null,
            cryptoInterface: null,
            loggerOptions: {
                loggerCallback: testLoggerCallback
            }
        });

        it("gets configured redirect uri", () => {
            expect(authModule.getRedirectUri()).to.be.deep.eq(TEST_URIS.TEST_REDIR_URI);
        });

        it("gets configured redirect uri if uri is a function", () => {
            expect(authModule_functionRedirectUris.getRedirectUri()).to.be.deep.eq(TEST_URIS.TEST_REDIR_URI);
        });

        it("throws error if redirect uri is null/empty", () => {
            expect(() => authModule_noRedirectUris.getRedirectUri()).to.throw(ClientConfigurationError.createRedirectUriEmptyError().message);
        });

        it("gets configured post logout redirect uri", () => {
            expect(authModule.getPostLogoutRedirectUri()).to.be.deep.eq(TEST_URIS.TEST_LOGOUT_URI);
        });

        it("gets configured post logout redirect uri if uri is a function", () => {
            expect(authModule_functionRedirectUris.getPostLogoutRedirectUri()).to.be.deep.eq(TEST_URIS.TEST_LOGOUT_URI);
        });

        it("throws error if post logout redirect uri is null/empty", () => {
            expect(() => authModule_noRedirectUris.getPostLogoutRedirectUri()).to.throw(ClientConfigurationError.createPostLogoutRedirectUriEmptyError().message);
        });
    });
});