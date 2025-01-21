declare global {
  interface Window {
    env: {
      apiUrl: string;
      websocketUrl: string;
    };
  }
}

export {};
