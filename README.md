# Token
É uma biblioteca construida em JS para ser client do Token

### Configuração
```
import TokenClient from 'token-client';
import AsyncStorage from '@react-native-community/async-storage';

//URL do servidor
const serverURL = 'https://server.com';

//Implemente uma pequena camada sobre o storage que deseja usar, no exemplo foi usado o AsyncStorage do React Native
const storage = {
    get: async (key) => {return await AsyncStorage.getItem(key)},
    set: async (key, value) => {await AsyncStorage.setItem(key, value)},
    delete: async (key) => {await AsyncStorage.removeItem(key)},
}

//String usada para criptografar o storage, é recomendado armazenar no .ENV
const encryptionString = process.env.encryptionString;

//Info coletada do device
const deviceInfo = {
    type: 'MOBILE', //os tipos são: WEB, MOBILE
    UUID: 'FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9', //chave única do device, smartphones tem seus próprios(recomendamos o uso de react-native-device-info), para navegadores recomendamos gerar um e armazenar no storage para fazer reuso.
    deviceID: 'iPhone7,2' //MOBILE usar deviceID e WEB usar user-agent
}

TokenClient.configure(serverURL, storage, encryptionString, deviceInfo);
```

### Link

```
import TokenClient from 'token-client';

//String usada para criptografar o storage, é recomendado armazenar no .ENV
const encryptionString = process.env.encryptionString;

//Info coletada do device
const deviceInfo = {
     type: 'MOBILE', //os tipos são: WEB, MOBILE
     UUID: 'FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9', //chave única do device, smartphones tem seus próprios(recomendamos o uso de react-native-device-info), para navegadores recomendamos gerar um e armazenar no storage para fazer reuso.
     deviceID: 'iPhone7,2' //MOBILE usar deviceID e WEB usar user-agent
 }

const JWT = '1234lkdfnlk3n4ogknerlkgn'; //JWT resultante do login com a térmica

TokenClient.device.link(encryptionString, deviceInfo, JWT);
```
### Criar Transação
```
import TokenClient from 'token-client';
//Após o token configurado é só chamar
const transaction = {} //é um objeto com a transação que será enviado para seu backend, para integração com o backend veja a outra documentação
const JWT = '1234lkdfnlk3n4ogknerlkgn'; //JWT resultante do login com a térmica
TokenClient.transaction.create(transaction, JWT);
```
### Cancelar Transação
```
import TokenClient from 'token-client';
//Após o token configurado é só chamar
const transactionId = 'c92un92udklsjdnf02-ciunwiufe' //é o ID da transação
const JWT = '1234lkdfnlk3n4ogknerlkgn'; //JWT resultante do login com a térmica
TokenClient.transaction.cancel(transactionId, JWT);
```
### Aprovar Transação
```
import TokenClient from 'token-client';

//Após o token configurado e linkado é só chamar

const deviceInfo = {
     type: 'MOBILE', //os tipos são: WEB, MOBILE
     UUID: 'FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9', //chave única do device, smartphones tem seus próprios(recomendamos o uso de react-native-device-info), para navegadores recomendamos gerar um e armazenar no storage para fazer reuso.
     deviceID: 'iPhone7,2' //MOBILE usar deviceID e WEB usar user-agent
 }
const transactionId = 'c92un92udklsjdnf02-ciunwiufe' //é o ID da transação
const encryptionString = process.env.encryptionString; //String usada para criptografar o storage, é recomendado armazenar no .ENV
const JWT = '1234lkdfnlk3n4ogknerlkgn'; //JWT resultante do login com a térmica
TokenClient.transaction.authorize(encryptionString, deviceInfo, JWT, transactionId);
```
### Recusar Transação
```
import TokenClient from 'token-client';

//Após o token configurado e linkado é só chamar

const deviceInfo = {
     type: 'MOBILE', //os tipos são: WEB, MOBILE
     UUID: 'FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9', //chave única do device, smartphones tem seus próprios(recomendamos o uso de react-native-device-info), para navegadores recomendamos gerar um e armazenar no storage para fazer reuso.
     deviceID: 'iPhone7,2' //MOBILE usar deviceID e WEB usar user-agent
 }
const transactionId = 'c92un92udklsjdnf02-ciunwiufe' //é o ID da transação
const encryptionString = process.env.encryptionString; //String usada para criptografar o storage, é recomendado armazenar no .ENV
const JWT = '1234lkdfnlk3n4ogknerlkgn'; //JWT resultante do login com a térmica
TokenClient.transaction.deny(encryptionString, deviceInfo, JWT, transactionId);
```

### Status da Transação
```
import TokenClient from 'token-client';
//Após o token configurado é só chamar

const transactionId = 'c92un92udklsjdnf02-ciunwiufe' //é o ID da transação
const JWT = '1234lkdfnlk3n4ogknerlkgn'; //JWT resultante do login com a térmica
TokenClient.transaction.status(transactionId, JWT);
```


### Gerar OTP
Após os steps de Configuração e vínculo do device basta executar o método generateOTP
```
import TokenClient from 'token-client';

//String usada para criptografar o storage, é recomendado armazenar no .ENV
const encryptionString = process.env.encryptionString;

const otp = await TokenClient.transaction.generateOTP(encryptionString);
```
