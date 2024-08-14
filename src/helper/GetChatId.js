// import { generateChatId } from "./GenerateChatId";
// import { db } from "../firebase";

// export const getChatId = async (user1Id, user2Id) => {
//   const sortedUserIds = [user1Id, user2Id].sort();
//   const chatDocRef = db.collection("Chats").doc(sortedUserIds.join("_"));

//   try {
//     const chatDoc = await chatDocRef.get();

//     if (!chatDoc.exists) {
//       console.log("Chat not found from firestore");
//       return generateChatId(user1Id, user2Id);
//     } else {
//       const chatId = chatDoc.id;
//       console.log("Chat ID:", chatId);
//       return chatId;
//     }
//   } catch (error) {
//     console.error("Error getting chat ID:", error);
//     return null;
//   }
// };

import { getFirestore, doc, getDoc, collection } from "firebase/firestore";
import { generateChatId } from "./GenerateChatId";
import { db } from "../firebase";

export const getChatId = async (user1Id, user2Id) => {
  const firestore = getFirestore();
  const sortedUserIds = [user1Id, user2Id].sort();
  const chatDocRef = doc(firestore, "Chats", sortedUserIds.join("_"));

  try {
    const chatDocSnap = await getDoc(chatDocRef);

    if (!chatDocSnap.exists()) {
      return generateChatId(user1Id, user2Id);
    } else {
      const chatId = chatDocSnap.id;

      return chatId;
    }
  } catch (error) {
    console.error("Error getting chat ID:", error);
    return null;
  }
};
