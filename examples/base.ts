class FNSAuthLKFL {
  constructor(inn: string, password: string, clientSecret: string) {

  }

  authenticate() {

  }

  refreshTokens() {

  }

  getAccessToken() {

  }

  clearTokens() {

  }
}

class SimpleTokens {

}

class EsiaOAuth2 {

}

class LKFL {

}

class TwoFactorByPhone {

}


class FNSClient {
  constructor(auth: FNSAuthLKFL) {
    // create axios
    // auth intercepter
    // add token intercepter
    // add refresh intercepter
  }
}

const auth = new FNSAuthLKFL('inn', 'pass', 'secret');
const client = new FNSClient(auth);

client.addReceipt(qr, options);
client.getReceipt(id);
client.removeReceipt();
client.getRceiptList();
