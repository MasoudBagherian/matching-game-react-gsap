import React from 'react';

const Modal = ({ message, type, modalRef }) => {
  let classes;
  if (type === 'error') {
    classes = 'modal modal--error';
  }
  if (type === 'success') {
    classes = 'modal modal--success';
  }
  if (type === 'win') {
    classes = 'modal modal--win';
  }
  return (
    <div ref={modalRef} className={classes}>
      {message}
    </div>
  );
};

export default Modal;
