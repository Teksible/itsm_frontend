import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography
} from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { DatePicker } from '@mui/x-date-pickers';
import GlobalService from "../../../services/GlobalService";
import { resturls } from "../../../global/utils/apiurls";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { parseISO } from "date-fns";

function GeneratedForm(props) {
  const {
    formFields,
    setFormFields,
    t,
    createBtn,
    generatedForm,
    selectCategoryType,
    className,
    setCallMethod,
    logo,
    selectedClass,
    initialValues,
    isEditMode,
    selectedItemId,
  } = props;

  console.log(formFields, initialValues, 'formFields');

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const createValidationSchema = (fields) => {
    const shape = {};

    fields.forEach((field) => {
      switch (field.fieldType) {
        case 'Text':
          shape[field.fieldName] = Yup.string().required(`${field.fieldName} is required`);
          break;
        case 'Number':
          shape[field.fieldName] = Yup.number().required(`${field.fieldName} is required`).typeError(`${field.fieldName} must be a number`);
          break;
        case 'Password':
          shape[field.fieldName] = Yup.string().required(`${field.fieldName} is required`).min(8, 'Password must be at least 8 characters');
          break;
        case 'Email':
          shape[field.fieldName] = Yup.string().required(`${field.fieldName} is required`).email('Invalid email format');
          break;
        case 'Select':
          shape[field.fieldName] = Yup.string().required(`${field.fieldName} is required`);
          break;
        case 'Boolean':
          shape[field.fieldName] = Yup.boolean();
          break;
        case 'Date':
          shape[field.fieldName] = Yup.date().required(`${field.fieldName} is required`).nullable();
          break;
        case 'Upload':
          const fileFormats = getAllowedFileExtensions(field.fileFormats);
          shape[field.fieldName] = Yup.mixed()
            .required(`${field.fieldName} is required`)
            .test('fileFormat', `Unsupported format. Allowed formats: ${fileFormats.join(', ')}`, (value) => {
              if (!value || !value.name) return false;
              console.log(value, 'valuevalidation');
              const fileExtension = value.name.split('.').pop().toLowerCase();
              return fileFormats.includes(fileExtension);
            });
          break;
        default:
          break;
      }
    });

    return Yup.object().shape(shape);
  };

  const getAllowedFileExtensions = (fileFormat) => {
    const fileExtensionMap = {
      Image: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      PDF: ['pdf'],
      Excel: ['xls', 'xlsx'],
    };

    return fileExtensionMap[fileFormat] || [fileFormat.toLowerCase()];
  };

  const handleRemoveField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  const getGeneretedFormList = () => {
    GlobalService.generalSelect(
      (respdata) => {
        const { estatus, data } = respdata;
        if (estatus && data && data) {
          setFormFields([]);
          setCallMethod(false);
        }
      },
      resturls.CreateClass,
      {
        attributes: formFields,
        itemRequirement: selectCategoryType,
        className,
        image: logo
      },
      'POST'
    );
  };

  const addItemRequirement = (values) => {
    const url = isEditMode ? resturls.updateClassInstance : resturls.CreateClassInstance;
    const requestBody = isEditMode
      ? { id: selectedItemId, values, classCategoryId: selectedClass }
      : { values, classCategoryId: selectedClass };

    GlobalService.generalSelect(
      (respdata) => {
        const { estatus, data: responseData } = respdata;
        if (estatus && estatus) {
        }
      },
      url,
      requestBody,
      'POST'
    );
  };

  const initialFormValues = formFields.reduce((acc, curr) => {
    if (curr.fieldType === 'Date') {
      acc[curr.fieldName] = isEditMode && initialValues && initialValues[curr.fieldName] !== undefined
        ? parseISO(initialValues[curr.fieldName])
        : null;
    } else if (curr.fieldType === 'Select') {
      acc[curr.fieldName] = isEditMode && initialValues && initialValues[curr.fieldName] !== undefined
        ? initialValues[curr.fieldName]
        : '';
    } else {
      acc[curr.fieldName] = isEditMode && initialValues && initialValues[curr.fieldName] !== undefined
        ? initialValues[curr.fieldName]
        : '';
    }
    return acc;
  }, {});

  const [fileName, setFileName] = useState('');

  const handleFileChange = async (event, setFieldValue, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      const base64File = await convertToBase64(file);
      setFileName(file.name);
      setFieldValue(fieldName, {
        base64: base64File,
        name: file.name,
        type: file.type,
      });
    }
  };


  return (
    <div>
      {createBtn && (
        <>
          <span><ArrowBackIcon onClick={() => setCallMethod(false)} /></span>
          <span><h3>Add Config Items</h3></span>
        </>
      )}
      <Box mt={4}>
        <Formik
          initialValues={initialFormValues}
          validationSchema={createValidationSchema(formFields)}
          onSubmit={(values, { resetForm }) => {
            addItemRequirement(values);
            resetForm();
          }}
        >
          {({ handleSubmit, handleChange, setFieldValue, values, errors, touched, resetForm }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {formFields.map((field, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6}>
                      <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {field.fieldName}
                        {selectedClass === '' && (
                          <IconButton onClick={() => handleRemoveField(index)} color="warning">
                            <RemoveCircleIcon />
                          </IconButton>
                        )}
                      </h4>
                      {console.log(values, 'values')}
                      {field.fieldType === 'Text' && (
                        <TextField
                          label={field.fieldName}
                          name={field.fieldName}
                          value={values[field.fieldName]}
                          onChange={handleChange}
                          fullWidth
                          error={touched[field.fieldName] && Boolean(errors[field.fieldName])}
                          helperText={touched[field.fieldName] && errors[field.fieldName]}
                        />
                      )}
                      {field.fieldType === 'Number' && (
                        <TextField
                          label={field.fieldName}
                          name={field.fieldName}
                          type="number"
                          value={values[field.fieldName]}
                          onChange={handleChange}
                          fullWidth
                          error={touched[field.fieldName] && Boolean(errors[field.fieldName])}
                          helperText={touched[field.fieldName] && errors[field.fieldName]}
                        />
                      )}
                      {field.fieldType === 'Password' && (
                        <TextField
                          label={field.fieldName}
                          name={field.fieldName}
                          type="password"
                          value={values[field.fieldName]}
                          onChange={handleChange}
                          fullWidth
                          error={touched[field.fieldName] && Boolean(errors[field.fieldName])}
                          helperText={touched[field.fieldName] && errors[field.fieldName]}
                        />
                      )}
                      {field.fieldType === 'Email' && (
                        <TextField
                          label={field.fieldName}
                          name={field.fieldName}
                          type="email"
                          value={values[field.fieldName]}
                          onChange={handleChange}
                          fullWidth
                          error={touched[field.fieldName] && Boolean(errors[field.fieldName])}
                          helperText={touched[field.fieldName] && errors[field.fieldName]}
                        />
                      )}
                      {field.fieldType === 'Select' && (
                        <FormControl fullWidth>
                          <InputLabel>{field.fieldName}</InputLabel>
                          <Select
                            label={field.fieldName}
                            name={field.fieldName}
                            value={values[field.fieldName]}
                            onChange={handleChange}
                          >
                            {field.optionList && field.optionList.map((option, optionIndex) => (
                              <MenuItem key={optionIndex} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched[field.fieldName] && errors[field.fieldName] && (
                            <Typography color="error">{errors[field.fieldName]}</Typography>
                          )}
                        </FormControl>
                      )}
                      {field.fieldType === 'Boolean' && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values[field.fieldName]}
                              onChange={handleChange}
                              name={field.fieldName}
                            />
                          }
                          label={field.fieldName}
                        />
                      )}
                      {field.fieldType === 'Date' && (
                        <FormControl fullWidth>
                          <DatePicker
                            label={field.fieldName}
                            value={values[field.fieldName]}
                            onChange={(date) => setFieldValue(field.fieldName, date)}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                          />
                        </FormControl>
                      )}
                      {field.fieldType === 'Upload' && (
                        <>
                          <input
                            accept={getAllowedFileExtensions(field.fileFormats).map(ext => `.${ext}`).join(',')}
                            type="file"
                            onChange={(e) => handleFileChange(e, setFieldValue, field.fieldName)}
                          />
                          <Typography variant="caption">
                            {fileName || 'No file selected'}
                          </Typography>
                          {/* {touched[field.fieldName] && errors[field.fieldName] && (
                            <Typography color="error">{errors[field.fieldName]}</Typography>
                          )} */}
                        </>
                      )}
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
              {(createBtn || isEditMode) && (
                <Box mt={2}>
                  <Button type="submit" variant="contained" disabled={formFields.length === 0} color="primary">
                    {t(isEditMode ? 'Update' : 'create')}
                  </Button>
                </Box>
              )}
            </Form>
          )}
        </Formik>
        <Box mt={2}>
          {generatedForm && (
            <Box mt={2}>
              <Button type="submit" variant="contained" disabled={formFields.length === 0} onClick={() => getGeneretedFormList()} color="primary">
                {t('submit_generated_form')}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default withTranslation()(GeneratedForm);
