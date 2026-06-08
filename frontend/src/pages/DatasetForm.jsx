import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createDataset, updateDataset } from '../store/datasetSlice';
import { showNotification } from '../store/uiSlice';
import apiClient from '../services/api';
import { ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';

const DatasetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.datasets);
  
  const [fetching, setFetching] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [formInitialValues, setFormInitialValues] = useState({
    id: '',
    instruction: '',
    input: '',
    output: '',
    metadata: {
      type: '',
      code_element: '',
      repo_name: '',
      file_path: '',
      source_type: 'github_repository',
      doc_type: '',
      is_readme: false,
      url: '',
    }
  });

  const isEditMode = !!id;

  // Prefill details on edit mode
  useEffect(() => {
    if (isEditMode) {
      setFetching(true);
      setErrorState(null);
      apiClient.get(`/datasets/${id}`)
        .then((res) => {
          const data = res.data.data;
          setFormInitialValues({
            id: data.id || '',
            instruction: data.instruction || '',
            input: data.input || '',
            output: data.output || '',
            metadata: {
              type: data.metadata?.type || '',
              code_element: data.metadata?.code_element || '',
              repo_name: data.metadata?.repo_name || '',
              file_path: data.metadata?.file_path || '',
              source_type: data.metadata?.source_type || 'github_repository',
              doc_type: data.metadata?.doc_type || '',
              is_readme: !!data.metadata?.is_readme,
              url: data.metadata?.url || '',
            }
          });
        })
        .catch((err) => {
          console.error(err);
          setErrorState('Failed to fetch dataset record details from backend.');
          dispatch(showNotification({ message: 'Failed to load dataset details', type: 'error' }));
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [id, isEditMode, dispatch]);

  // Formik Configuration
  const formik = useFormik({
    initialValues: formInitialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      id: Yup.string().required('Dataset ID identifier is required'),
      instruction: Yup.string().required('Instruction prompt is required'),
      input: Yup.string().nullable(),
      output: Yup.string().required('Expected output code is required'),
      metadata: Yup.object({
        type: Yup.string().required('Type is required'),
        code_element: Yup.string().nullable(),
        repo_name: Yup.string().required('Repository name is required'),
        file_path: Yup.string().required('File path location is required'),
        source_type: Yup.string().required('Source type is required'),
        doc_type: Yup.string().nullable(),
        is_readme: Yup.boolean().nullable(),
        url: Yup.string().url('Must be a valid URL address').nullable(),
      })
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        metadata: {
          ...values.metadata,
          is_readme: !!values.metadata.is_readme
        }
      };

      if (isEditMode) {
        dispatch(updateDataset({ id, datasetData: payload }))
          .unwrap()
          .then(() => {
            dispatch(showNotification({ message: 'Dataset updated successfully', type: 'success' }));
            navigate('/explorer');
          })
          .catch((err) => {
            dispatch(showNotification({ message: err || 'Update failed', type: 'error' }));
          });
      } else {
        dispatch(createDataset(payload))
          .unwrap()
          .then(() => {
            dispatch(showNotification({ message: 'Dataset created successfully', type: 'success' }));
            navigate('/explorer');
          })
          .catch((err) => {
            dispatch(showNotification({ message: err || 'Creation failed', type: 'error' }));
          });
      }
    }
  });

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm text-slate-400">Loading dataset details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/explorer')}
          className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200/40 dark:border-dark-border/40"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            {isEditMode ? 'Edit Dataset' : 'Create New Dataset'}
            {!isEditMode && <Sparkles className="w-5 h-5 text-brand-500" />}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isEditMode ? `Modify parameters for record #${id}` : 'Seed a new code dataset instruction pair'}
          </p>
        </div>
      </div>

      {errorState && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-xs font-semibold text-rose-500">
          {errorState}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={formik.handleSubmit} className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-6 rounded-3xl shadow-sm space-y-6">
        
        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Custom ID Identifier */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Dataset ID
            </label>
            <input
              type="text"
              name="id"
              placeholder="e.g. d250"
              disabled={isEditMode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.id}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                formik.touched.id && formik.errors.id
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
            {formik.touched.id && formik.errors.id ? (
              <div className="text-xs text-rose-500 font-semibold">{formik.errors.id}</div>
            ) : null}
          </div>

          {/* Repo Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Repository Name
            </label>
            <input
              type="text"
              name="metadata.repo_name"
              placeholder="e.g. huggingface/transformers"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.metadata.repo_name}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                formik.touched.metadata?.repo_name && formik.errors.metadata?.repo_name
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
            {formik.touched.metadata?.repo_name && formik.errors.metadata?.repo_name ? (
              <div className="text-xs text-rose-500 font-semibold">{formik.errors.metadata.repo_name}</div>
            ) : null}
          </div>

          {/* File Path */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              File Path
            </label>
            <input
              type="text"
              name="metadata.file_path"
              placeholder="e.g. src/utils/helpers.py"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.metadata.file_path}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                formik.touched.metadata?.file_path && formik.errors.metadata?.file_path
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
            {formik.touched.metadata?.file_path && formik.errors.metadata?.file_path ? (
              <div className="text-xs text-rose-500 font-semibold">{formik.errors.metadata.file_path}</div>
            ) : null}
          </div>

          {/* Source URL */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Source URL
            </label>
            <input
              type="text"
              name="metadata.url"
              placeholder="https://github.com/..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.metadata.url}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none transition-all ${
                formik.touched.metadata?.url && formik.errors.metadata?.url
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
            {formik.touched.metadata?.url && formik.errors.metadata?.url ? (
              <div className="text-xs text-rose-500 font-semibold">{formik.errors.metadata.url}</div>
            ) : null}
          </div>

          {/* Classification Type */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Classification Type
            </label>
            <select
              name="metadata.type"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.metadata.type}
              className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none border-slate-200 dark:border-dark-border focus:border-brand-500 transition-all cursor-pointer capitalize"
            >
              <option value="">-- Select Type --</option>
              <option value="function">Function</option>
              <option value="function_implementation">Function Implementation</option>
              <option value="class">Class</option>
              <option value="class_implementation">Class Implementation</option>
              <option value="documentation">Documentation</option>
              <option value="docstring_generation">Docstring Generation</option>
              <option value="readme">README based</option>
            </select>
            {formik.touched.metadata?.type && formik.errors.metadata?.type ? (
              <div className="text-xs text-rose-500 font-semibold">{formik.errors.metadata.type}</div>
            ) : null}
          </div>

          {/* Code Element / Format */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Format / Code Element
            </label>
            <input
              type="text"
              name="metadata.doc_type"
              placeholder="e.g. py, js, md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.metadata.doc_type || formik.values.metadata.code_element}
              className="w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none border-slate-200 dark:border-dark-border focus:border-brand-500 transition-all"
            />
          </div>

          {/* Toggles (Source Type and README) */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-dark-border pt-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_readme"
                name="metadata.is_readme"
                onChange={formik.handleChange}
                checked={formik.values.metadata.is_readme}
                className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500/20 cursor-pointer"
              />
              <label htmlFor="is_readme" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                Is README based record?
              </label>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-slate-400">Source type:</span>
              <select
                name="metadata.source_type"
                onChange={formik.handleChange}
                value={formik.values.metadata.source_type}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-lg"
              >
                <option value="github_repository">GitHub Repository</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Big Code Textareas */}
        <div className="space-y-4 border-t border-slate-100 dark:border-dark-border pt-5">
          {/* Instruction */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Instruction Prompt
            </label>
            <textarea
              name="instruction"
              rows={4}
              placeholder="Provide the training prompt or instruction..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.instruction}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-dark-card outline-none font-sans transition-all resize-y ${
                formik.touched.instruction && formik.errors.instruction
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
            {formik.touched.instruction && formik.errors.instruction ? (
              <div className="text-xs text-rose-500 font-semibold">{formik.errors.instruction}</div>
            ) : null}
          </div>

          {/* Input Context */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Input Context (Optional)
            </label>
            <textarea
              name="input"
              rows={3}
              placeholder="Provide additional input parameters or code environment..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.input}
              className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-dark-card font-mono outline-none border-slate-200 dark:border-dark-border focus:border-brand-500 transition-all resize-y"
            />
          </div>

          {/* Expected Output */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Expected Output Code
            </label>
            <textarea
              name="output"
              rows={6}
              placeholder="Write the expected output code or text response..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.output}
              className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-dark-card font-mono outline-none resize-y transition-all ${
                formik.touched.output && formik.errors.output
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-dark-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
            {formik.touched.output && formik.errors.output ? (
              <div className="text-xs text-rose-500 font-semibold">{formik.errors.output}</div>
            ) : null}
          </div>
        </div>

        {/* Action Controls */}
        <div className="border-t border-slate-100 dark:border-dark-border pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-500/10 cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditMode ? 'Save Changes' : 'Create Dataset'}
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default DatasetForm;
