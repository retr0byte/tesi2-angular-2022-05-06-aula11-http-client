import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last } from 'rxjs/operators';

interface Response {
  time: {
    updated: string;
  };
  bpi: {
    USD: {
      description: string;
      rate_float: number;
    };
    BRL: {
      description: string;
      rate_float: number;
    };
  };
}

@Injectable()
export class BitcoinService {
  private apiUrl: string =
    'https://api.coindesk.com/v1/bpi/currentprice/BRL.json';
  current: Response;
  list: Array<Response> = [];
  counter: number = 0;
  alert: boolean = false;
  alertMessage: string;

  constructor(private http: HttpClient) {}

  getData() {
    this.http.get<Response>(this.apiUrl).subscribe((data) => {
      this.updateBitcoinRates(data);
    });
  }

  updateBitcoinRates(current: Response) {
    let lastDataSaved =
      this.list.length > 0 ? this.list[this.list.length - 1] : null;

    if (lastDataSaved) {
      if (
        current.bpi.USD.rate_float != lastDataSaved.bpi.USD.rate_float &&
        current.bpi.BRL.rate_float != lastDataSaved.bpi.BRL.rate_float
      ) {
        this.list.push(current);
        this.showAlert('Novas informações adicionadas com sucesso!');
      } else {
        this.showAlert('Não encontramos valores mais recentes...');
      }
    } else {
      this.list.push(current);
      this.showAlert('Novas informações adicionadas com sucesso!');
    }
  }

  startCount() {
    let timer = setInterval(() => {
      this.counter++;

      if (this.counter == 20) {
        this.stopCount(timer);

        this.getData();

        this.counter = 0;
        this.startCount();
      }
    }, 1000);
  }

  stopCount(interval) {
    clearInterval(interval);
  }

  timeUntilUpdate() {
    return 20 - this.counter;
  }

  showAlert(message: string) {
    this.alertMessage = message;
    this.alert = true;
    setTimeout(() => {
      this.alert = false;
    }, 3000);
  }
}
