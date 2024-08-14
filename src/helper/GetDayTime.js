export const getDayTime = () => {
  var myDate = new Date();
  var hrs = myDate.getHours();

  if (hrs < 12) return 'GOOD MORNING 🌅';
  else if (hrs >= 12 && hrs <= 17) return 'GOOD AFTERNOON 🌞';
  else if (hrs >= 17 && hrs <= 24) return 'GOOD EVENING 🌇 ';
};
