import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { doc as firestoreDoc, getDoc, collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import supabase from "../../supabase";
import "./styles/Messages.css";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState({});
  const [userProfiles, setUserProfiles] = useState({});
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const chatId = new URLSearchParams(location.search).get("chatId");

  const fetchUserProfile = async (userId) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profile) {
        return profile;
      }

      // Fallback to Firebase user data if no Supabase profile exists
      const userDoc = await getDoc(firestoreDoc(db, "users", userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid)
    );
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsList = [];
      const newProfiles = {};
      
      for (const doc of snapshot.docs) {
        const chatData = doc.data();
        const otherUserId = chatData.participants.find(id => id !== user.uid);
        
        if (!userProfiles[otherUserId]) {
          const profile = await fetchUserProfile(otherUserId);
          if (profile) {
            newProfiles[otherUserId] = profile;
          }
        }
        
        chatsList.push({ 
          id: doc.id, 
          ...chatData,
          otherUser: newProfiles[otherUserId] || userProfiles[otherUserId]
        });
      }
      
      setUserProfiles(prev => ({ ...prev, ...newProfiles }));
      setChats(chatsList);

      if (chatId) {
        const chat = chatsList.find((chat) => chat.id === chatId);
        setCurrentChat(chat);
      }
    });

    return () => unsubscribe();
  }, [user, chatId]);

  useEffect(() => {
    if (!currentChat) return;

    const q = query(
      collection(db, "chats", currentChat.id, "messages"),
      where("createdAt", ">=", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      setChatMessages(messages.sort((a, b) => a.createdAt - b.createdAt));
    });

    return () => unsubscribe();
  }, [currentChat]);

  const formatMessageTime = (date) => {
    if (!date) return '';
    const messageDate = date.toDate();
    return messageDate.toLocaleTimeString([], { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    }).toUpperCase();
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat) return;

    try {
      await addDoc(collection(db, "chats", currentChat.id, "messages"), {
        senderId: user.uid,
        text: message,
        createdAt: new Date(),
      });

      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="messages-container">
      <div className="chats-sidebar">
        <h2>Messages</h2>
        <div className="chats-list">
          {chats.map((chat) => {
            const otherUserId = chat.participants.find(id => id !== user.uid);
            const otherUser = userProfiles[otherUserId];
            
            return (
              <div
                key={chat.id}
                className={`chat-item ${currentChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => setCurrentChat(chat)}
              >
                <img
                  src={otherUser?.avatar_url || '/default-avatar.png'}
                  alt=""
                  className="chat-avatar"
                />
                <div className="chat-info">
                  <h3>{otherUser?.full_name || otherUser?.displayName || 'USER'}</h3>
                  <p className="last-message">
                    {chat.lastMessage?.text || 'START CHATTING...'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chat-main">
        {currentChat ? (
          <>
            <div className="chat-header">
              <img
                src={userProfiles[currentChat.participants.find(id => id !== user.uid)]?.avatar_url || '/default-avatar.png'}
                alt=""
                className="chat-header-avatar"
              />
              <span className="chat-header-name">
                {userProfiles[currentChat.participants.find(id => id !== user.uid)]?.full_name || 'USER'}
              </span>
            </div>

            <div className="messages-list">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.senderId === user.uid ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p>{msg.text}</p>
                    <span className="message-time">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="message-input-container">
              <div className="message-input-wrapper">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="TYPE A MESSAGE..."
                  rows="1"
                />
                <button 
                  className="send-button"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h2>Select a conversation to start messaging</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;