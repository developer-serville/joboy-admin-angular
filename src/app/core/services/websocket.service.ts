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
            console.log(' WebSocket Connected');
            console.log('State:', this.socket.readyState);

            const registerMessage = {
                type: 'register',
                clientId: token
            };

            console.log(' Registering:', registerMessage);

            this.send(registerMessage);
        };

        this.socket.onmessage = (event) => {
            console.log(' Raw Message:', event.data);

            try {
                const data = JSON.parse(event.data);
                this.messageSubject.next(data);
            } catch {
                this.messageSubject.next(event.data);
            }
        };

        this.socket.onerror = (event) => {
            console.error(' WebSocket Error:', event);
        };

        this.socket.onclose = (event) => {
            console.log(' WebSocket Closed');
            console.log('Code:', event.code);
            console.log('Reason:', event.reason);
            console.log('Was Clean:', event.wasClean);
        };
    }

    send(data: any): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {

            console.log('📤 Sending:', data);

            this.socket.send(JSON.stringify(data));

        } else {
            console.warn('WebSocket is not connected.');
        }
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close();
        }
    }
}