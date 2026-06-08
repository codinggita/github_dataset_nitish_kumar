import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/api';

// Async Thunks
export const fetchDatasets = createAsyncThunk(
  'datasets/fetchDatasets',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { page, limit, sort, filters, searchQuery } = getState().datasets;
      
      // Determine endpoint: use search endpoint if searchQuery is set
      let endpoint = '/datasets';
      const params = { page, limit };

      if (searchQuery) {
        endpoint = '/search/datasets';
        params.q = searchQuery;
      }

      // Add sort if set
      if (sort) {
        params.sort = sort;
      }

      // Add other filters
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params[key] = filters[key];
        }
      });

      const response = await apiClient.get(endpoint, { params });
      return {
        datasets: response.data.data,
        resultsCount: response.data.results || response.data.data.length,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch datasets');
    }
  }
);

export const createDataset = createAsyncThunk(
  'datasets/createDataset',
  async (datasetData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/datasets/protected/datasets', datasetData);
      return { dataset: response.data.data, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create dataset');
    }
  }
);

export const updateDataset = createAsyncThunk(
  'datasets/updateDataset',
  async ({ id, datasetData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/datasets/protected/datasets/${id}`, datasetData);
      return { dataset: response.data.data, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update dataset');
    }
  }
);

export const deleteDataset = createAsyncThunk(
  'datasets/deleteDataset',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/datasets/protected/datasets/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete dataset');
    }
  }
);

export const restoreDataset = createAsyncThunk(
  'datasets/restoreDataset',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/datasets/protected/datasets/${id}/restore`);
      return { dataset: response.data.data, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to restore dataset');
    }
  }
);

export const bulkDeleteDatasets = createAsyncThunk(
  'datasets/bulkDeleteDatasets',
  async ({ ids, hard = false }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/datasets/bulk-delete?hard=${hard}`, { data: { ids } });
      return { ids, hard, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed bulk delete operation');
    }
  }
);

export const bulkRestoreDatasets = createAsyncThunk(
  'datasets/bulkRestoreDatasets',
  async (ids, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/datasets/bulk-restore', { ids });
      return { ids, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed bulk restore operation');
    }
  }
);

export const bulkUpdateDatasets = createAsyncThunk(
  'datasets/bulkUpdateDatasets',
  async ({ updates, filter, update }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch('/datasets/bulk-update', { updates, filter, update });
      return { message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed bulk update operation');
    }
  }
);


const initialState = {
  items: [],
  loading: false,
  error: null,
  successMessage: null,
  
  // Pagination & Filtering state
  page: 1,
  limit: 10,
  totalResults: 0,
  sort: '',
  searchQuery: '',
  filters: {
    type: '',
    repo: '',
    source: '',
    docType: '',
    language: '',
    framework: '',
    category: '',
    deleted: '', // '' for active, 'true' for deleted, 'all' for all
  },

};

const datasetSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1; // Reset to page 1 on limit change
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.page = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
      state.sort = '';
      state.page = 1;
    },
    clearDatasetError: (state) => {
      state.error = null;
    },
    clearDatasetSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Datasets
      .addCase(fetchDatasets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDatasets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.datasets;
        state.totalResults = action.payload.resultsCount;
      })
      .addCase(fetchDatasets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Dataset
      .addCase(createDataset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDataset.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.dataset);
        state.successMessage = action.payload.message;
      })
      .addCase(createDataset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Dataset
      .addCase(updateDataset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDataset.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.dataset.id || item._id === action.payload.dataset._id);
        if (index !== -1) {
          state.items[index] = action.payload.dataset;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(updateDataset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Dataset
      .addCase(deleteDataset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDataset.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload.id && item._id !== action.payload.id);
        state.successMessage = action.payload.message;
      })
      .addCase(deleteDataset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Restore Dataset
      .addCase(restoreDataset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreDataset.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.dataset.id || item._id === action.payload.dataset._id);
        if (index !== -1) {
          state.items[index] = action.payload.dataset;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(restoreDataset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Bulk Delete Datasets
      .addCase(bulkDeleteDatasets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteDatasets.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.hard) {
          state.items = state.items.filter(
            item => !action.payload.ids.includes(item.id) && !action.payload.ids.includes(item._id)
          );
        } else {
          action.payload.ids.forEach(id => {
            const index = state.items.findIndex(item => item.id === id || item._id === id);
            if (index !== -1) {
              state.items[index].isDeleted = true;
            }
          });
          if (state.filters.deleted === '') {
            state.items = state.items.filter(
              item => !action.payload.ids.includes(item.id) && !action.payload.ids.includes(item._id)
            );
          }
        }
        state.successMessage = action.payload.message;
      })
      .addCase(bulkDeleteDatasets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Bulk Restore Datasets
      .addCase(bulkRestoreDatasets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkRestoreDatasets.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.ids.forEach(id => {
          const index = state.items.findIndex(item => item.id === id || item._id === id);
          if (index !== -1) {
            state.items[index].isDeleted = false;
          }
        });
        if (state.filters.deleted === 'true') {
          state.items = state.items.filter(
            item => !action.payload.ids.includes(item.id) && !action.payload.ids.includes(item._id)
          );
        }
        state.successMessage = action.payload.message;
      })
      .addCase(bulkRestoreDatasets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Bulk Update Datasets
      .addCase(bulkUpdateDatasets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateDatasets.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(bulkUpdateDatasets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const {
  setPage,
  setLimit,
  setSort,
  setSearchQuery,
  setFilter,
  resetFilters,
  clearDatasetError,
  clearDatasetSuccess,
} = datasetSlice.actions;

export default datasetSlice.reducer;
