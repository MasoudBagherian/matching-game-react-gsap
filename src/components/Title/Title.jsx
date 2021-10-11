import React, {
  useRef,
  createRef,
  useEffect,
  useContext,
  useLayoutEffect,
} from 'react';

import { Context } from './../../context/ContextProvider';

import { TITLE as title } from '../utils/globals';
import { shuffle } from './../utils/shuffleArray';

import { gsap } from 'gsap';

const Title = () => {
  const { showImages, imgs } = useContext(Context);

  const titleRef = useRef(title.split('').map(() => createRef()));

  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span className="title__char" key={index} ref={titleRef.current[index]}>
        {char}
      </span>
    ));
  };

  const getTitleChars = () => titleRef.current.map((item) => item.current);
  useLayoutEffect(() => {
    gsap.set(getTitleChars(), { opacity: 0, x: -300 });
  }, []);
  useEffect(() => {
    if (!imgs) {
      return;
    }

    gsap.to(shuffle(getTitleChars()), {
      x: 0,
      opacity: 1,
      ease: 'back.out(1.7)',
      stagger: {
        each: 0.1,
      },
      onComplete: showImages,
    });
  }, [imgs]);

  return (
    <h1 className="title">
      <pre className="title__text">{splitText(title)}</pre>
    </h1>
  );
};

export default Title;
