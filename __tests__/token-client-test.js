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
    axios.post.mockResolvedValue({data:{terminalToken: '3b826222b2394ef79fe5e2035cd4a4003444a3c27ed062ab0c1b4210aa85d0843529bda7d9996760b9ee1a5ac4bb7e98f8cf26910589e0f0f0d2fee75fded32c'}});
    await TokenClient.configure('https://localhost', storage, encryptionString, deviceInfo);
    axios.post.mockResolvedValue({data:{deviceToken: '375918fc89647ac8503da7bb07e00968d9b07c4337f2f4d7bb6b7495ae2aaaa80459ea2fdbe5c267bf27133bf5c49a98470f266b022efac8b09b21f349b41e04'}});
    await TokenClient.device.link(encryptionString, deviceInfo, '1234lkdfnlk3n4ogknerlkgn');
    let otp = await TokenClient.transaction.generateOTP(encryptionString);
    console.log(otp);
    expect(otp).toBeTruthy();
});
