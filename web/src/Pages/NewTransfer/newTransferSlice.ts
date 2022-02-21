import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export interface NewTransferState {
  recent: boolean;
  phrase: string;
}

const initialState: NewTransferState = {
  recent: false,
  phrase: "",
};

export const newTransferSlice = createSlice({
  name: "newTransfer",
  initialState,
  reducers: {
    setRecentTransfer: (state, action: PayloadAction<boolean>) => {
      state.recent = action.payload;
    },
    setNewTransferPhrase: (state, action: PayloadAction<string>) => {
      state.phrase = action.payload;
    },
  },
});

export const { setRecentTransfer, setNewTransferPhrase } =
  newTransferSlice.actions;

export const selectRecentTransfer = (state: RootState) =>
  state.newTransfer.recent;

export const selectNewTransferPhrase = (state: RootState) =>
  state.newTransfer.phrase;

export default newTransferSlice.reducer;
