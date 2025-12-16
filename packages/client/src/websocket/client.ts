// ABOUTME: WebSocket client with automatic reconnection
// ABOUTME: Handles server communication with exponential backoff retry

import type { ClientMessage, ServerMessage } from "@end-of-line/shared";

export type ConnectionState = "connecting" | "connected" | "disconnected";

export type WebSocketClientOptions = {
  url: string;
  onMessage: (message: ServerMessage) => void;
  onStateChange: (state: ConnectionState) => void;
  maxRetries?: number;
  baseDelay?: number;
};

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: (message: ServerMessage) => void;
  private onStateChange: (state: ConnectionState) => void;
  private maxRetries: number;
  private baseDelay: number;
  private retryCount = 0;
  private shouldReconnect = true;

  constructor(options: WebSocketClientOptions) {
    this.url = options.url;
    this.onMessage = options.onMessage;
    this.onStateChange = options.onStateChange;
    this.maxRetries = options.maxRetries ?? 10;
    this.baseDelay = options.baseDelay ?? 1000;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.onStateChange("connecting");
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.retryCount = 0;
      this.onStateChange("connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as ServerMessage;
        this.onMessage(message);
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    };

    this.ws.onclose = () => {
      this.onStateChange("disconnected");
      this.attemptReconnect();
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }

  private attemptReconnect(): void {
    if (!this.shouldReconnect || this.retryCount >= this.maxRetries) {
      return;
    }

    const delay = this.baseDelay * Math.pow(2, this.retryCount);
    this.retryCount++;

    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect();
      }
    }, delay);
  }

  send(message: ClientMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.ws?.close();
    this.ws = null;
  }

  getState(): ConnectionState {
    if (!this.ws) return "disconnected";
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      default:
        return "disconnected";
    }
  }
}

// Singleton instance for easy import
let clientInstance: WebSocketClient | null = null;

export function initWebSocket(
  options: WebSocketClientOptions,
): WebSocketClient {
  clientInstance = new WebSocketClient(options);
  return clientInstance;
}

export function getWebSocket(): WebSocketClient | null {
  return clientInstance;
}
