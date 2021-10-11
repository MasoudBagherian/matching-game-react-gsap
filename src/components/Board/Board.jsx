import React, {
  useRef,
  createRef,
  useEffect,
  useContext,
  useLayoutEffect,
  useState,
  useMemo,
} from 'react';

import { Context } from './../../context/ContextProvider';

import { BOARD_IMAGES as images } from '../utils/globals';
import { shuffle } from './../utils/shuffleArray';

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import Modal from '../../UI/Modal/Modal';
gsap.registerPlugin(Draggable);

const Board = () => {
  const [matchCount, setMatchCount] = useState(0);
  const [winCount, setWinCount] = useState(0);

  const endImgs = useMemo(() => {
    return shuffle(images.endImgs);
  }, [winCount]);
  const startImgs = useMemo(() => {
    return shuffle(images.startImgs);
  }, [winCount]);
  const { setImages, showImages } = useContext(Context);

  const boardRef = useRef();
  const startImgsRef = useRef(images.startImgs.map(() => createRef()));
  const endImgsRef = useRef(images.endImgs.map(() => createRef()));
  const modalRef = useRef({
    error: createRef(),
    success: createRef(),
    win: createRef(),
  });

  const getStartImgs = () => startImgsRef.current.map((item) => item.current);
  const getEndImgs = () => endImgsRef.current.map((item) => item.current);
  const getAllImgs = () => [...getStartImgs(), ...getEndImgs()];

  const resetPosition = (item) => {
    gsap.to(item, 0.5, { x: 0, y: 0 });
  };
  const getMatchedItem = (searchedItem) => {
    return getEndImgs().find(
      (item) =>
        item.getAttribute('match') === searchedItem.getAttribute('match')
    );
  };
  const updatePosition = (startItem, endItem, ev) => {
    const endX = endItem.getBoundingClientRect().x;
    const endY = endItem.getBoundingClientRect().y;
    gsap.to(startItem, 0.6, {
      x: endX - ev.startX,
      y: endY - ev.startY,
      onComplete: hiddenItems.bind(null, [startItem, endItem]),
    });
  };
  const checkMatch = (startItem, endItem) => {
    const startX = startItem.getBoundingClientRect().x;
    const endX = endItem.getBoundingClientRect().x;
    const diffX = endX - startX;
    const startY = startItem.getBoundingClientRect().y;
    const endY = endItem.getBoundingClientRect().y;
    const diffY = endY - startY;
    return diffX < 50 && diffX > -50 && diffY < 50 && diffY > -50;
  };
  const hiddenItems = (items) => {
    gsap.to(items, 0.5, { autoAlpha: 0 });
  };
  const hideModal = (modal, type) => {
    gsap.to(modal, 0.5, {
      autoAlpha: 0,
      scale: 0,
      scale: 0,
      ease: 'back.in',
      delay: 1,
      onComplete: function () {
        if (type === 'success') {
          setMatchCount((prev) => prev + 1);
        }
        if (type === 'win') {
          resetGame();
        }
      },
    });
  };
  const showModal = (type) => {
    let modal;
    if (type === 'success') {
      modal = getSuccessModal();
    }
    if (type === 'error') {
      modal = getErrModal();
    }
    if (type === 'win') {
      modal = getWinModal();
    }
    gsap.to(modal, 0.5, {
      autoAlpha: 1,
      scale: 1,
      ease: 'back',
      onComplete: () => hideModal(modal, type),
    });
  };
  function handleDragEnd(e) {
    const matchedItem = getMatchedItem(this.target);

    if (checkMatch(this.target, matchedItem)) {
      updatePosition(this.target, matchedItem, this);

      showModal('success');
    } else {
      resetPosition(this.target);
      showModal('error');
    }
  }
  const getErrModal = () => modalRef.current.error.current;
  const getSuccessModal = () => modalRef.current.success.current;
  const getWinModal = () => modalRef.current.win.current;
  const resetAllImgs = () =>
    gsap.set(getAllImgs(), { autoAlpha: 0, scale: 0, x: 0, y: 0 });
  const resetModals = () =>
    gsap.set([getErrModal(), getSuccessModal(), getWinModal()], {
      autoAlpha: 0,
      scale: 0,
    });
  const resetGame = () => {
    resetAllImgs();
    showImages();
    setMatchCount(0);
    setWinCount((prev) => prev + 1);
  };
  useLayoutEffect(() => {
    resetAllImgs();
    resetModals();
  }, []);

  useEffect(() => {
    setImages(getAllImgs());
    Draggable.create(getStartImgs(), {
      bounds: boardRef.current,
      edgeResistance: 0.65,
      onDragStart: function (e) {
        this.startX = this.target.getBoundingClientRect().x;
        this.startY = this.target.getBoundingClientRect().y;
      },
      onDragEnd: handleDragEnd,
    });
  }, []);
  useEffect(() => {
    if (matchCount === startImgs.length) {
      showModal('win');
    }
  }, [matchCount]);
  return (
    <>
      <Modal
        type="error"
        message="try again"
        modalRef={modalRef.current.error}
      />
      <Modal
        type="success"
        message="correct"
        modalRef={modalRef.current.success}
      />
      <Modal type="win" message="you win" modalRef={modalRef.current.win} />
      <div className="board" ref={boardRef}>
        <h3 className="board__title">
          drag the image below and match to the image on the another side
        </h3>
        <div className="board__body">
          <div className="board__start">
            <div className="board__cells">
              {startImgs.map((img, index) => (
                <div key={index} className="board__image">
                  <img
                    src={img.src}
                    match={img.key}
                    alt=""
                    ref={startImgsRef.current[index]}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="board__end">
            <div className="board__cells">
              {endImgs.map((img, index) => (
                <div key={index} className="board__image">
                  <img
                    draggable="false"
                    src={img.src}
                    match={img.key}
                    alt=""
                    ref={endImgsRef.current[index]}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
