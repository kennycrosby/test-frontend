import React from 'react';
import './Sentence.scss';
import { motion } from 'framer-motion';

import { Transcript } from '../Player/Player';

const DURATION = 0.75;

const sentenceVariants = {
  inactive: {
    opacity: 0,
    transition: { duration: DURATION, ease: 'easeInOut', delay: 1 }
  },
  active: {
    opacity: 1,
    transition: { duration: DURATION, ease: 'easeInOut' }
  }
};

const wordVariants = {
  inactive: {
    opacity: 0.4,
    scale: 1,
    transition: { duration: .5, ease: 'easeIn' }
  },
  active: {
    opacity: 1,
    scale: [1, 1.11, 1.11, 1],
    transition: { times: [0, 0.3, 0.6, 1], duration: .5, ease: 'easeOut' }
  }
};

interface SentenceProps {
  sentenceArr: Transcript[];
  active: boolean;
}

export function Sentence(props: SentenceProps) {
  const { sentenceArr, active } = props;

  return (
    <motion.h2 className="sentence" variants={sentenceVariants} animate={active ? 'active' : 'inactive'}>
      {sentenceArr.map((t: Transcript, i: number) => (
        <motion.span
          className="word"
          key={i + t.word}
          variants={wordVariants}
          animate={i+1 === sentenceArr.length ? 'active' : 'inactive'}
        >
          {t.word}{' '}
        </motion.span>
      ))}
    </motion.h2>
  );
}
