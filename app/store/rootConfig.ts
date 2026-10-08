interface StorageType {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<string>;
  removeItem: (key: string) => Promise<void>;
}

const noopStorage: StorageType = {
  getItem(_key: string) {
    return Promise.resolve(null);
  },

  setItem(_key: string, value: string) {
    return Promise.resolve(value);
  },

  removeItem(_key: string) {
    return Promise.resolve();
  },
};

let storage: StorageType;

if (typeof window !== "undefined") {
  storage = require("redux-persist/lib/storage").default;
} else {
  storage = noopStorage;
}

export const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "booking"],
};
