import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
    scale: 0.99,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -15,
    scale: 0.99,
  },
};

const pageTransition = {
  type: 'spring',
  stiffness: 150,
  damping: 17,
  mass: 0.5,
};

// Staggered children animation
const containerVariants = {
  initial: { 
    opacity: 0 
  },
  in: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  },
  out: { 
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
    }
  }
};

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.main
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="overflow-hidden"
    >
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="in"
        exit="out"
      >
        {children}
      </motion.div>
    </motion.main>
  );
};

export default PageTransition;
