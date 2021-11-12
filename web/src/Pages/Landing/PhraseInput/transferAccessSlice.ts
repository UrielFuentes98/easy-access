import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export interface TransferAccessState {
  transfer_id: number;
  secretQuestion: string;
  answer: string;
}

const initialState: TransferAccessState = {
  transfer_id: 0,
  secretQuestion: "",
  answer: "",
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
  },
});

export const { setTransferId, setSecretQuestion, setAnswer } =
  transferAccessSlice.actions;

export const selectSecretQuestion = (state: RootState) =>
  state.transferAccess.secretQuestion;

export const selectTransferId = (state: RootState) =>
  state.transferAccess.transfer_id;

export const selectAnswer = (state: RootState) => state.transferAccess.answer;

export default transferAccessSlice.reducer;
