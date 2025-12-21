const DATABASE_NAME = "SpriteEditorDatabase";
const DATABASE_KEY_VALUE_TABLE = "KeyValueTable";
const DATABASE_KEY_NAME = "key";
const DATABASE_VALUE_NAME = "value";

export class IndexDBHelper {

    static async set(key: string, value: any) {
        return new Promise<void>(async (resolve, reject) => {
            const db = await this.getDatabase();
    
            const transaction = db.transaction([DATABASE_KEY_VALUE_TABLE], "readwrite");
            const objectStore = transaction.objectStore(DATABASE_KEY_VALUE_TABLE);
    
            const object = { [DATABASE_KEY_NAME]: key, [DATABASE_VALUE_NAME]: value };
            
            const request = objectStore.put(object);

            request.onerror = (event) => {
                reject("Cannot store object.");
            };
            
            request.onsuccess = (event) => {
                resolve();
            };
        });
    }

    static async get(key: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const db = await this.getDatabase();
    
            const transaction = db.transaction([DATABASE_KEY_VALUE_TABLE], "readwrite");
            const objectStore = transaction.objectStore(DATABASE_KEY_VALUE_TABLE);

            const request = objectStore.get(key);

            request.onerror = (event) => {
                reject("Cannot get key");
            };

            request.onsuccess = (event) => {
                resolve(request.result[DATABASE_VALUE_NAME]);
            };
        });

    }

    private static getDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DATABASE_NAME, 1);

            request.onupgradeneeded = (event) => {
                // Save the IDBDatabase interface
                const db = ((event.target as any).result as IDBDatabase);

                db.createObjectStore(DATABASE_KEY_VALUE_TABLE, { keyPath: DATABASE_KEY_NAME });
            };

            request.onerror = (event) => {
                console.error("Why didn't you allow my web app to use IndexedDB?!");
                reject("Cannot get database handle");
            };

            request.onsuccess = (event) => {
                resolve(((event.target as any).result as IDBDatabase));
            };

        });

    }
}