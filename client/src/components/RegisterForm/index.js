import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { HOST } from '../Token'
import styles from './RegisterForm.module.scss'
import Input from '../Input'
import axios from 'axios'
import PropTypes from 'prop-types'

export default function RegisterForm(props) {
  const [formStatus, setFormStatus] = useState({ type: null, message: '' })

  const handleSubmit = (orderInfo, { resetForm }) => {
    axios
      .post(HOST + '/customers', orderInfo)
      .then((savedCustomer) => {
        setFormStatus({
          type: 'success',
          message: 'You are successfully registered',
        })
        props.setActiveBtnSignIn()
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          const massageData = err.response.data
          const objectKey = Object.keys(massageData)[0]
          const errorMessage = massageData[objectKey]
          setFormStatus({
            type: 'error',
            message: `Registration failed! ${errorMessage}`,
          })
        } else {
          // Fallback error message in case the structure of the error object is unexpected
          setFormStatus({
            type: 'error',
            message: 'Registration failed due to an unknown error.',
          })
        }
      })
    resetForm()
  }

  return (
    <>
      {formStatus.type !== null && (
        <p
          className={`${styles['form-massage']} ${
            formStatus.type === 'error' && styles['form-massage__error']
          }`}
        >
          {formStatus.message}
        </p>
      )}
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          login: '',
          email: '',
          password: '',
          telephone: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(25, 'Must be 25 characters or less')
            .min(2, 'Must be more than 1 characters')
            .required('Firstname is required')
            .matches(/^[^\p{P}\p{S}\d]+$/u, 'Invalid firstname format'),
          lastName: Yup.string()
            .max(25, 'Must be 25 characters or less')
            .min(2, 'Must be more than 1 character')
            .required('Lastname is required')
            .matches(/^[^\p{P}\p{S}\d]+$/u, 'Invalid lastname format'),
          login: Yup.string()
            .max(10, 'Login must be between 3 and 10 characters')
            .min(3, 'Login must be between 3 and 10 characters')
            .matches(/^[a-zA-Z0-9]+$/, 'Invalid login format')
            .required('Email is required'),
          email: Yup.string()
            .matches(
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              'Invalid email format',
            )
            .required('Email is required'),
          password: Yup.string()
            .matches(
              /^[a-zA-Z0-9]+$/,
              'Allowed characters for password is a-z, A-Z, 0-9.',
            )
            .required('Password is required')
            .max(30, 'Password must be between 7 and 30 characters')
            .min(7, 'Password must be between 7 and 30 characters'),
          telephone: Yup.string()
            .matches(
              /^\+380\d{3}\d{2}\d{2}\d{2}$/,
              'That is not a valid phone number. Example valid form number: +380501234567',
            )
            .required('Mobile is required'),
        })}
      >
        <Form className="form__user-address" noValidate>
          <Field
            type="text"
            placeholder="firstName"
            name="firstName"
            component={Input}
          />
          <Field
            type="text"
            placeholder="lastName"
            name="lastName"
            component={Input}
          />
          <Field
            type="text"
            placeholder="login"
            name="login"
            component={Input}
          />
          <Field
            type="email"
            placeholder="email"
            name="email"
            component={Input}
          />
          <Field
            type="password"
            placeholder="password"
            name="password"
            component={Input}
          />
          <Field
            type="tel"
            placeholder="telephone"
            name="telephone"
            component={Input}
          />
          <div>
            <button className={styles['btn-send--register']} type="submit">
              Send
            </button>
          </div>
        </Form>
      </Formik>
    </>
  )
}

RegisterForm.propTypes = {
  setActiveBtnSignIn: PropTypes.func,
}
