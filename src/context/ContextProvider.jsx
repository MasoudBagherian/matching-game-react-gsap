import React, { createContext, useState } from 'react';
import { gsap } from 'gsap';
export const Context = createContext();
const ContextProvider = (props) => {
  const [imgs, setImgs] = useState(null);
  const setImages = (items) => setImgs(items);
  const showImages = () => {
    gsap.to(imgs, {
      autoAlpha: 1,
      scale: 1,
      ease: 'back',
      stagger: {
        each: 0.1,
      },
    });
  };
  return (
    <Context.Provider value={{ showImages, imgs, setImages }}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
