import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { SignalRService } from './services/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 
  title = 'signalR_example';

  _signalRSvc = inject(SignalRService);
  private _http = inject(HttpClient);

  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Real time data for the chart'],
    datasets: [
    ]
  };

  labels = ['Real time bar chart'];
  

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        min: 0
      }
    }
  };
  

  ngOnInit(): void {
    this._signalRSvc.startConnection();
    this._signalRSvc.addTransferChartDataListener();
    this._signalRSvc.addBroadcastChartDataListener();
    this.startHttpRequest();
  }


  private startHttpRequest(): void {
    this._http.get('https://localhost:5001/api/chart')
    .subscribe(x => console.log(x));
  }

  chartClicked = (event: any) => {
    console.log(event);
    this._signalRSvc.broadcastChartData();
  }


}
