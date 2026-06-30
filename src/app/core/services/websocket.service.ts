import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    private socket!: WebSocket;
    private messageSubject = new Subject<any>();

    messages$ = this.messageSubject.asObservable();

    connect(token: string): void {

        if (
            this.socket &&
            (
                this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING
            )
        ) {
            console.log('WebSocket already connected/connecting');
            return;
        }

        const url = `${environment.webSocketUrl}?token=${token}`;

        console.log('Connecting to:', url);

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('🟢 WebSocket Connected');
            console.log('State:', this.socket.readyState); // Should be 1
        };

        this.socket.onmessage = (event) => {
            console.log('📩 Message:', event.data);
        };

        this.socket.onerror = (event) => {
            console.error('❌ WebSocket Error:', event);
        };

        this.socket.onclose = (event) => {
            console.log('🔴 WebSocket Closed');
            console.log('Code:', event.code);
            console.log('Reason:', event.reason);
            console.log('Was Clean:', event.wasClean);
        };
    }

    send(data: any): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close();
        }
    }
}