import { configureStore, createSlice } from '@reduxjs/toolkit';
const initialState = {
  reactionCondition: {
    taskId: '',
  },
  reactionYield: {
    taskId: '',
    inferenceTaskId: '',
  },
  reactionType: {
    taskId: '',
  },
  page: "home"
};

const slice = createSlice({
  name: "slice",
  initialState: initialState,
  reducers: {
    setCondition: (state, action) => {
      state.reactionCondition.taskId = action.payload;
    },
    setYield: (state, action) => {
      state.reactionYield.taskId = action.payload;
    },
    setInferenceYield: (state, action) => {
      state.reactionYield.inferenceTaskId = action.payload;
    },
    setType: (state, action) => {
      state.reactionType.taskId = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearCondition: (state) => {
      state.reactionCondition.taskId = '';
    },
    clearYield: (state) => {
      state.reactionYield.taskId = '';
    },
    clearInferenceYield: (state) => {
      state.reactionYield.inferenceTaskId = '';
    },
    clearType: (state) => {
      state.reactionType.taskId = '';
    }
  },
});

export const { setCondition, setYield, setType, setPage, clearCondition, clearYield, clearType, setInferenceYield, clearInferenceYield } = slice.actions;

export const store = configureStore({
  reducer: {
    slice: slice.reducer,
  },
});
