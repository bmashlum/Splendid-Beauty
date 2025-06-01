/**
 * Centralized z-index values to prevent conflicts
 * Higher values appear on top
 */
export const zIndex = {
  // Base level elements
  base: 0,
  
  // Interactive elements
  hoverPoints: 10,
  overlayButtons: 20,
  
  // Navigation
  navbar: 30,
  mobileMenu: 40,
  
  // Floating elements
  floatingChatButton: 40,
  floatingChatWidget: 45,
  
  // Tooltips and popovers
  tooltip: 50,
  popover: 50,
  
  // Modal overlays
  modalBackdrop: 90,
  modal: 95,
  videoModal: 100,
  
  // System messages
  toast: 110,
  alert: 120,
} as const;

export type ZIndexKey = keyof typeof zIndex;