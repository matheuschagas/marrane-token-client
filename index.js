import axios from 'axios';
import CryptoJS from 'crypto-js';
import HOTP from 'hotp';
import io from 'socket.io-client';

const tokenClientConfigured = () => {
    if (TokenClient.serverURL === null || TokenClient.terminalKey === null || TokenClient.apiURL === null || TokenClient.storage === null) {
        throw `TokenClient isn't configured`
    }
}
const TokenClient = {
    serverURL: null,
    apiURL: null,
    terminalKey: null,
    storage: null,
    configure: async (serverURL, apiURL, storage, encryptionString, deviceInfo) => {
        TokenClient.serverURL = serverURL;
        TokenClient.apiURL = apiURL;
        TokenClient.storage = storage;
        const tokenString = await storage.get('@MARRANETOKEN-TokenString');
        let terminalKey = null;
        if (!!tokenString) {
            terminalKey = CryptoJS.AES.decrypt(tokenString, encryptionString);
        }
        if (!!terminalKey) {
            TokenClient.terminalKey = terminalKey;
        } else {
            let res = await axios.post(`${TokenClient.apiURL}/terminal`, {deviceInfo});
            let crypt = CryptoJS.AES.encrypt(res.data.terminalKey, encryptionString);
            await storage.set('@MARRANETOKEN-TokenString', crypt.toString());
            TokenClient.terminalKey = res.data.terminalKey;
        }
    },
    device: {
        link: async (encryptionString, deviceInfo, jwt) => {
            tokenClientConfigured();
            let res = await axios.post(`${TokenClient.apiURL}/device/link`, {
                deviceInfo,
                terminalKey: TokenClient.terminalKey,
                jwt
            });
            let crypt = CryptoJS.AES.encrypt(res.data.deviceKey, encryptionString);
            await TokenClient.storage.set('@MARRANETOKEN-DeviceToken', crypt.toString());
        },
        // unlink: () => {
        //     tokenClientConfigured();
        // },
    },
    transaction: {
        create: async (encryptionString, deviceInfo, jwt) => {
            tokenClientConfigured();
            let encryptedString = await TokenClient.storage.get('@MARRANETOKEN-TokenString');
            let terminalKey = CryptoJS.AES.decrypt(encryptedString, encryptionString);
            let res = await axios.post(`${TokenClient.apiURL}/transaction`, {deviceInfo, terminalKey, jwt});
            return res.data.transaction;
        },
        cancel: async (encryptionString, deviceInfo, jwt, transaction) => {
            tokenClientConfigured();
            let encryptedString = await TokenClient.storage.get('@MARRANETOKEN-TokenString');
            let terminalKey = CryptoJS.AES.decrypt(encryptedString, encryptionString);
            await axios.delete(`${TokenClient.apiURL}/transaction/${transaction}/delete`, {
                headers: {Authorization: jwt},
                data: {
                    deviceInfo,
                    terminalKey,
                }
            });
        },
        authorize: async (encryptionString, deviceInfo, jwt, transaction) => {
            tokenClientConfigured();
            let encryptedString = await TokenClient.storage.get('@MARRANETOKEN-DeviceToken');
            let deviceKey = CryptoJS.AES.decrypt(encryptedString, encryptionString);
            let otp = await TokenClient.transaction.generateOTP(encryptionString);
            let res = await axios.post(`${TokenClient.apiURL}/transaction/${transaction}/authorize`, {
                deviceInfo,
                deviceKey,
                otp
            }, {headers:{Authorization: jwt}});
        },
        deny: async (encryptionString, deviceInfo, jwt, transaction) => {
            tokenClientConfigured();
            let encryptedString = await TokenClient.storage.get('@MARRANETOKEN-DeviceToken');
            let deviceKey = CryptoJS.AES.decrypt(encryptedString, encryptionString);
            let otp = await TokenClient.transaction.generateOTP(encryptionString);
            let res = await axios.post(`${TokenClient.apiURL}/transaction/${transaction}/deny`, {
                deviceInfo,
                deviceKey,
                otp
            }, {headers:{Authorization: jwt}});
        },
        generateOTP: async (encryptionString) => {
            tokenClientConfigured();
            let encryptedString = await TokenClient.storage.get('@MARRANETOKEN-DeviceToken');
            let key = CryptoJS.AES.decrypt(encryptedString, encryptionString);
            return HOTP.totp(key.toString(CryptoJS.enc.Utf8), {digits: 6, time: Date.now() / 1000, timeStep: 24});
        },
        status: async (transaction, jwt) => {
            tokenClientConfigured();
            let res = await axios.get(`${TokenClient.serverURL}/transaction/${transaction}`, {headers:{Authorization: jwt}});
            return res;
        },
        // listen: (encryptionString, jwt, transaction) => {
        //     //TODO socket
        //     const socket = io.connect(`${TokenClient.serverURL}/socket/`);
        //     socket.on('connect', () => {
        //         socket.emit('join', `{transaction: ${transaction}, jwt: ${jwt}`);
        //     });
        //     socket.on('message', function (msg) {
        //
        //     });
        // }
    }
}

export default TokenClient;
