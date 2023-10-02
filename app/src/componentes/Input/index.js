import React from 'react';
import './styles.css';

function Input({label,...rest}) {

  return (
    <div className='input-container'>
      {label&&
        <label htmlFor="">{label}</label>
      }
      <input type="text" {...rest} />
    </div>
  )
}

export default Input;