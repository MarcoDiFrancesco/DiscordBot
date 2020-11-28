export const cleanMessage = message => {
  // e.g. -> ?command arg1 arg2 arg3
  let message_str = message.content;
  // Remove first character from string
  // e.g. -> command arg1 arg2 arg3
  if (message_str[0] === process.env.PREFIX) {
    message_str = message_str.slice(1);
  }
  // Remove starting and ending spaces from string
  message_str = message_str.trim();
  // Split string into array
  // " " is replaced / +/ is used to not get an empty
  // item in the array if 2 spaces are placed
  message_str = message_str.split(/ +/);
  return message_str;
}