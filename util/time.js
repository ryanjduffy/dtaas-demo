// function today() {
//   const now = new Date();
//   const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   return current.getTime();
// }

// function week() {
//   const now = new Date();
//   const current = new Date(
//     now.getFullYear(),
//     now.getMonth(),
//     now.getDate() - now.getDay()
//   );
//   return current.getTime();
// }

// function month() {
//   const now = new Date();
//   const current = new Date(now.getFullYear(), now.getMonth(), 0);
//   return current.getTime();
// }

// function quarter() {
//   const now = new Date();
//   const current = new Date(
//     now.getFullYear(),
//     Math.floor(now.getMonth() / 4),
//     0
//   );
//   return current.getTime();
// }
const DAY = 1000 * 60 * 60 * 24;

function today() {
  const now = new Date();
  return now.getTime() - DAY;
}

function week() {
  const now = new Date();
  return now.getTime() - DAY * 7;
}

function month() {
  const now = new Date();
  return now.getTime() - DAY * 30;
}

function quarter() {
  const now = new Date();
  return now.getTime() - DAY * 90;
}

export { today, week, month, quarter };
