import axios from 'axios';

const FCM_SERVER = 'https://fcm.googleapis.com/fcm/send';
const FIREBASE_SERVER_KEY =
  'Bearer AAAAsVLC2-4:APA91bHL_TxCmJsAxDvYZ60aeB18Z6mAjuhyI7ytJi938xYoaQtdldzImyyUJoxKRrMRK4BFHWMMuQ9KMJAThzPciZpPRDcmMB3zHdiBQPDT2RgWHeb8NkNiAIk7WKwo6v6ka5aGPTtx';

export const sendMessageNotification = (
  fcm,
  title,
  message,
  userId,

  chatId,
  profile,
) => {
  let data2 = {
    to: fcm,
    content_available: true,
    priority: 'high',
    notification: {
      title: title,
      body: message,
    },

    data: {
      userId: userId,

      chatId: chatId,
      profile: profile,
    },
  };
  var config = {
    method: 'post',
    url: FCM_SERVER,
    headers: {
      Authorization: FIREBASE_SERVER_KEY,
      'Content-Type': ' application/json',
    },
    data: JSON.stringify(data2),
  };

  axios(config)
    .then(function (response) {})
    .catch(function (error) {});
};
