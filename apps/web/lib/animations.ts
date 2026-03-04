import { Variants } from 'framer-motion'

// 7-step page load sequence from spec section 3.1
export const pageLoadVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15 }
  }
}

export const statusBarVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, delay: 0.1 }
  }
}

export const statsCardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 20,
      delay: 0.2
    }
  }
}

export const dataGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, delay: 0.4 }
  }
}

export const activityFeedVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, delay: 0.3 }
  }
}

export const accuracyChartVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: 0.5 }
  }
}

export const actionBarVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, delay: 0.6 }
  }
}

// Micro-interactions from spec section 3.3
export const buttonHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
}

export const cardHoverVariants: Variants = {
  rest: { y: 0, boxShadow: 'var(--shadow-md)' },
  hover: { 
    y: -4, 
    boxShadow: 'var(--shadow-lg)',
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  }
}

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } }
}

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}