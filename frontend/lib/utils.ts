// // Helper function to format the presence text dynamically
// export function formatPresenceText(users: string[]) {
//   const count = users.length;
//   if (count === 0) return 'Connecting...';
//   if (count === 1) return `${users[0]} is viewing`;
//   if (count === 2) return `${users[0]} and ${users[1]} are viewing`;
//   return `${users[0]}, ${users[1]}, and ${count - 2} other${count - 2 > 1 ? 's' : ''} viewing`;
// }

// Simple foolproof random ID generator
 export const generateAnonymousId = () => {
  return 'user_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};