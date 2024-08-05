"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const persistor = persistStore(storeRef.current);

  return (
    <>
      <PersistGate persistor={persistor}>
        <Provider store={storeRef.current}>{children}</Provider>
      </PersistGate>
    </>
  );
}
