import { Injectable } from '@angular/core';
import { ChartModel } from '../interfaces/chartmodel.model';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  
  data!: ChartModel[];
  broadcastedData!: ChartModel[];


  private hubConnection!: signalR.HubConnection;

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chart')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  };

  addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      console.log(data)
      this.data = data;
     
    });
  };

  broadcastChartData = () => {
    const data = this.data.map(m => {
      const temp = {
        data: m.data,
        label: m.label
      }
      return temp;
    });

    this.hubConnection.invoke('broadcastchartdata', data)
    .catch(err => console.log(err));
  }

  addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      this.broadcastedData = data;
    })
  }
}
