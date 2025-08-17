import AsyncStorage from "@react-native-async-storage/async-storage";

export enum Keys {
    AUTH_TOKEN = "AUTH_TOKEN",
    REFRESH_TOKEN = "REFRESH_TOKEN",
    EMAIL = "EMAIL",
    PASSWORD = "PASSWORD",
}

export class Storage {
    static async save(key: string, value: string) {
        await AsyncStorage.setItem(key, value);
    }

    static async get(key: string) {
        return await AsyncStorage.getItem(key);
    }

    static async remove(key: string) {
        await AsyncStorage.removeItem(key);
    }

    static async clear() {
        await AsyncStorage.clear();
    }

    static get keys() {
        return Keys;
    }
}
