import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentAPI } from '../../services/api';

// Async thunks
export const fetchStudents = createAsyncThunk(
    'students/fetchStudents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await studentAPI.getAll();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch students');
        }
    }
);

export const createStudent = createAsyncThunk(
    'students/createStudent',
    async (studentData, { rejectWithValue }) => {
        try {
            const response = await studentAPI.create(studentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create student');
        }
    }
);

export const updateStudent = createAsyncThunk(
    'students/updateStudent',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await studentAPI.update(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update student');
        }
    }
);

export const deleteStudent = createAsyncThunk(
    'students/deleteStudent',
    async (id, { rejectWithValue }) => {
        try {
            await studentAPI.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete student');
        }
    }
);

const initialState = {
    students: [],
    loading: false,
    error: null,
    selectedStudent: null,
};

const studentSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        setSelectedStudent: (state, action) => {
            state.selectedStudent = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch students
            .addCase(fetchStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create student
            .addCase(createStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.students.push(action.payload);
            })
            .addCase(createStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update student
            .addCase(updateStudent.fulfilled, (state, action) => {
                const index = state.students.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.students[index] = action.payload;
                }
            })
            // Delete student
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.students = state.students.filter(s => s.id !== action.payload);
            });
    },
});

export const { setSelectedStudent, clearError } = studentSlice.actions;
export default studentSlice.reducer;
