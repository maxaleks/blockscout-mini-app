interface TelegramWebApps {
  WebApp: {
    ready: () => void;
    close: () => void;
    expand: () => void;
    initData: string;
    initDataUnsafe: {
      query_id: string;
      user?: {
        id: number;
        first_name: string;
        last_name: string;
        username: string;
        language_code: string;
      };
      auth_date: string;
      hash: string;
      start_param?: string;
    };
    MainButton: {
      text: string;
      color: string;
      textColor: string;
      isVisible: boolean;
      isActive: boolean;
      setText: (text: string) => void;
      onClick: (callback: () => void) => void;
      show: () => void;
      hide: () => void;
      enable: () => void;
      disable: () => void;
    };
    BackButton: {
      isVisible: boolean;
      onClick: (callback: () => void) => void;
      show: () => void;
      hide: () => void;
    };
    onEvent: (eventType: string, eventHandler: () => void) => void;
    offEvent: (eventType: string, eventHandler: () => void) => void;
    sendData: (data: any) => void;
    // Add other WebApp methods and properties as needed
  };
}

declare global {
  interface Window {
    Telegram: TelegramWebApps;
  }
}

export {};
