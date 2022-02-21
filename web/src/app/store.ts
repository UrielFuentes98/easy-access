import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import transferAccessReducer from "Pages/Landing/PhraseInput/transferAccessSlice";
import newTransferReducer from "Pages/NewTransfer/newTransferSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    transferAccess: transferAccessReducer,
    newTransfer: newTransferReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
