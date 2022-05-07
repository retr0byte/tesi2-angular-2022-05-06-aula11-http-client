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
        current.bpi.USD.rate_float === lastDataSaved.bpi.USD.rate_float &&
        current.bpi.USD.rate_float === lastDataSaved.bpi.USD.rate_float
      ) {
        this.list.push(current);
      }
    } else {
      this.list.push(current);
    }
  }

  startCount() {
    let timer = setInterval(() => {
      this.counter++;

      if (this.counter == 60) {
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
    return 60 - this.counter;
  }
}
