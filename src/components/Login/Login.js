import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';

import AuthContext from '../../store/auth-context';

const emailReducer = ( state, action ) => {
  if(action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@')};
  }
  if(action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@')};
  }
  return { value: '', isValid: false};
};

const passwordReducer = (state, action) => {
  if(action.type === 'USER_INPUT') {
    return { value: action.val, isValid:action.val.trim().length > 6}
  }
  if(action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6}
  }
  return { value: '', isValid: false}
}

const Login = (props) => {
  const ctx = useContext(AuthContext);

//  const [enteredEmail, setEnteredEmail] = useState('');
//  const [emailIsValid, setEmailIsValid] = useState();
// const [enteredPassword, setEnteredPassword] = useState('');
// const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer( emailReducer, { value: '', isValid: false} );
  const [passwordState, dispatchPassword] = useReducer( passwordReducer, { value: '', isValid: false} );
  
  useEffect( () => {
    const identifier = setTimeout( ()=> {
      console.log('Check for validity');
      setFormIsValid( emailState.isValid && passwordState.isValid)
    }, 500);
    
    //Cleanup function
    return () => {
      clearTimeout(identifier);
    };
  }, [emailState.isValid, passwordState.isValid]);

   const emailChangeHandler = (event) => {
    dispatchEmail({type:'USER_INPUT',val: event.target.value});
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type:'USER_INPUT', val: event.target.value});
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    ctx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
          id='email'
          type='email'
          label='E-Mail'
          isValid={emailState.isValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input 
            id="password"
            type="password"
            label='Password'
            isValid={passwordState.isValid}
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
