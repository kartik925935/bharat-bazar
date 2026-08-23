// src/lib/constants/shortcuts.ts

export const SHORTCUT_GROUPS = [
  {
    group: 'Global',
    shortcuts: [
      { keys: ['Cmd', 'K'], description: 'Open command palette' },
      { keys: ['Esc'], description: 'Close any open modal/drawer' },
      { keys: ['?'], description: 'Show shortcuts panel' },
    ],
  },
  {
    group: 'Navigation',
    shortcuts: [
      { keys: ['G', 'D'], description: 'Go to Dashboard' },
      { keys: ['G', 'O'], description: 'Go to Orders' },
      { keys: ['G', 'S'], description: 'Go to Sellers' },
      { keys: ['G', 'P'], description: 'Go to Products' },
      { keys: ['G', 'C'], description: 'Go to Customers' },
      { keys: ['G', 'F'], description: 'Go to Finance' },
    ],
  },
  {
    group: 'Tables',
    shortcuts: [
      { keys: ['/'], description: 'Focus table search' },
      { keys: ['X'], description: 'Toggle row selection' },
      { keys: ['Shift', 'A'], description: 'Select all visible rows' },
    ],
  },
  {
    group: 'Actions',
    shortcuts: [
      { keys: ['Cmd', 'Z'], description: 'Undo last action' },
      { keys: ['Cmd', 'E'], description: 'Export current table view' },
    ],
  },
]
