"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType
} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './carouselArrowButtons'
import { DotButton, useDotButton } from './carouselDotButtons'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Modal from './Modal';

const TWEEN_FACTOR_BASE = 0.2

type PropType = {
  slides: string[] // Updated to accept string array for image URLs
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])
  const tweenFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalImageKey, setModalImageKey] = useState(0); // for transition

  // Update key to trigger transition on image change
  useEffect(() => {
    if (modalOpen) setModalImageKey(modalIndex);
  }, [modalIndex, modalOpen]);

  // For modal carousel navigation
  const handleImageClick = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };
  const handleModalPrev = () => {
    setModalIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  const handleModalNext = () => {
    setModalIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Swipe gesture state for modal
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
    setTouchEndX(null);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.changedTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleModalNext(); // swipe left
        } else {
          handleModalPrev(); // swipe right
        }
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__parallax__layer') as HTMLElement
    })
  }, [])

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenParallax = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine()
      const scrollProgress = emblaApi.scrollProgress()
      const slidesInView = emblaApi.slidesInView()
      const isScrollEvent = eventName === 'scroll'

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress
        const slidesInSnap = engine.slideRegistry[snapIndex]

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target()

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target)

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress)
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress)
                }
              }
            })
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100
          const tweenNode = tweenNodes.current[slideIndex]
          tweenNode.style.transform = `translateX(${translate}%)`
        })
      })
    },
    []
  )

  useEffect(() => {
    if (!emblaApi) return

    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenParallax(emblaApi)

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi, tweenParallax])

  return (
    <>
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((url, index) => (
              <div className="embla__slide" key={index}>
                <div className="embla__parallax">
                  <div className="embla__parallax__layer">
                    <Image
                      src={url}
                      alt={`Property Image ${index + 1}`}
                      width={600}
                      height={350}
                      layout="responsive"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleImageClick(index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="embla__controls">
            <div className="embla__buttons">
              <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
              <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>

            <div className="embla__dots">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={'embla__dot'.concat(
                    index === selectedIndex ? ' embla__dot--selected' : ''
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} fullWidth={true}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 0,
            minHeight: 200,
            width: '100vw',
            height: '80vh',
            padding: 0,
            boxSizing: 'border-box',
            background: 'black',
            position: 'relative',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.length > 1 && (
            <button
              onClick={handleModalPrev}
              aria-label="Previous image"
              className="modal-arrow modal-arrow-left"
              style={{
                fontSize: 32,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                marginRight: 12,
                position: 'absolute',
                left: 24,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                display: 'none', // default hidden, show via CSS on desktop
              }}
            >
              &#8592;
            </button>
          )}
          <div
            key={modalImageKey}
            style={{
              width: '100vw',
              height: '80vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.4s',
              opacity: 1,
              position: 'relative',
            }}
            className="modal-image-fade"
          >
            <Image
              src={slides[modalIndex]}
              alt={`Property Image ${modalIndex + 1}`}
              width={1920}
              height={1080}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '1rem',
                background: 'black',
                maxWidth: '100vw',
                maxHeight: '80vh',
                boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
              }}
            />
          </div>
          {slides.length > 1 && (
            <button
              onClick={handleModalNext}
              aria-label="Next image"
              className="modal-arrow modal-arrow-right"
              style={{
                fontSize: 32,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                marginLeft: 12,
                position: 'absolute',
                right: 24,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                display: 'none', // default hidden, show via CSS on desktop
              }}
            >
              &#8594;
            </button>
          )}
          <style jsx>{`
            @media (min-width: 768px) {
              .modal-arrow {
                display: block !important;
              }
            }
            .modal-image-fade {
              opacity: 1;
              transition: opacity 0.4s;
            }
          `}</style>
        </div>
      </Modal>
    </>
  )
}

export default EmblaCarousel
