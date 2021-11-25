import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export interface TransferAccessState {
  transfer_id: number;
  secretQuestion: string;
  answer: string;
  access_authorized: boolean;
}

const initialState: TransferAccessState = {
  transfer_id: 0,
  secretQuestion: "",
  answer: "",
  access_authorized: false,
};

export const transferAccessSlice = createSlice({
  name: "transferAccess",
  initialState,
  reducers: {
    setTransferId: (state, action: PayloadAction<number>) => {
      state.transfer_id = action.payload;
    },
    setSecretQuestion: (state, action: PayloadAction<string>) => {
      state.secretQuestion = action.payload;
    },
    setAnswer: (state, action: PayloadAction<string>) => {
      state.answer = action.payload;
    },
    setAccessStatus: (state, action: PayloadAction<boolean>) => {
      state.access_authorized = action.payload;
    },
  },
});

export const { setTransferId, setSecretQuestion, setAnswer, setAccessStatus } =
  transferAccessSlice.actions;

export const selectSecretQuestion = (state: RootState) =>
  state.transferAccess.secretQuestion;

export const selectTransferId = (state: RootState) =>
  state.transferAccess.transfer_id;

export const selectAnswer = (state: RootState) => state.transferAccess.answer;

export const selectAccessState = (state: RootState) =>
  state.transferAccess.access_authorized;

export default transferAccessSlice.reducer;
