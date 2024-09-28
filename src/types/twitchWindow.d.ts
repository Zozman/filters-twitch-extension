declare global {
    interface Window {
      Twitch: {
        ext: {
            onAuthorized: (authCallback: CallableFunction) => void;
            onContext: (contextCallback: CallableFunction) => void;
            onError: (errorCallback: CallableFunction) => void;
        },
      };
    }
}

export {}