import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
 return {
  getItem(_key: string) {
   console.log(_key);

   return Promise.resolve(null);
  },
  setItem(_key: string, value: string) {
   console.log(_key, value);

   return Promise.resolve(value);
  },
  removeItem(_key: string) {
   console.log(_key);

   return Promise.resolve();
  },
 };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export default storage;