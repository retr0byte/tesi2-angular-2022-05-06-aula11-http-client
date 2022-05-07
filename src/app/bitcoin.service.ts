import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

interface Alerts {
  enabled: boolean;
  message: string;
  highlight: AlertHighlights;
}

enum AlertHighlights {
  danger = 'alert-danger',
  success = 'alert-success',
}

@Injectable()
export class BitcoinService {
  private apiUrl: string =
    'https://api.coindesk.com/v1/bpi/currentprice/BRL.json';

  private counter: number = 0;
  private updateInterval: number = 60;
  list: Array<Response> = [];
  alert: Alerts = {
    enabled: false,
    message: '',
    highlight: AlertHighlights.danger,
  };

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
        this.showAlert(
          'Novas informações adicionadas com sucesso!',
          AlertHighlights.success
        );
      } else {
        this.showAlert(
          'Não encontramos valores mais recentes...',
          AlertHighlights.danger
        );
      }
    } else {
      this.list.push(current);
      this.showAlert(
        'Novas informações adicionadas com sucesso!',
        AlertHighlights.success
      );
    }
  }

  startCount() {
    let timer = setInterval(() => {
      this.counter++;

      if (this.counter == this.updateInterval) {
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
    return this.updateInterval - this.counter;
  }

  showAlert(message: string, highlightType: AlertHighlights) {
    this.alert = {
      enabled: true,
      message,
      highlight: highlightType,
    };

    setTimeout(() => {
      this.alert.enabled = false;
    }, 3000);
  }
}
