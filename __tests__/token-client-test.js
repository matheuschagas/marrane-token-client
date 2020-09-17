import TokenClient from "../index";
import axios from 'axios';
import CryptoJS from 'crypto-js';
jest.mock('axios');

const storage = {
    storage: {},
    get: async (key) => {
        return storage.storage[key]
    },
    set: async (key, value) => {
        storage.storage[key] = value
    },
    delete: async (key) => {
        delete storage.storage[key]
    },
}

const encryptionString = '12345';

const deviceInfo = {
    type: 'MOBILE', //os tipos são: WEB, MOBILE
    UUID: 'FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9', //chave única do device, smartphones tem seus próprios(recomendamos o uso de react-native-device-info), para navegadores recomendamos gerar um e armazenar no storage para fazer reuso.
    deviceID: 'iPhone7,2' //MOBILE usar deviceID e WEB usar user-agent
}

test('crash without configure', async () => {
    axios.post.mockResolvedValue({data:{deviceKey: 'deviceKey'}});
    expect.assertions(1);
    expect(TokenClient.device.link(encryptionString, deviceInfo, '1234lkdfnlk3n4ogknerlkgn')).rejects.toEqual('TokenClient isn\'t configured');
})

test('generateOTP', async () => {
    axios.post.mockResolvedValue({data:{terminalKey: 'terminalKey'}});
    await TokenClient.configure('https://localhost', storage, encryptionString, deviceInfo);
    axios.post.mockResolvedValue({data:{deviceKey: 'deviceKey'}});
    await TokenClient.device.link(encryptionString, deviceInfo, '1234lkdfnlk3n4ogknerlkgn');
    let otp = await TokenClient.transaction.generateOTP(encryptionString);
    console.log(otp);
    expect(otp).toBeTruthy();
});
