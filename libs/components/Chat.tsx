import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Box, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Badge from "@mui/material/Badge";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import { useRouter } from "next/router";
import ScrollableFeed from "react-scrollable-feed";
// import { RippleBadge } from "../../scss/MaterialTheme/styled";
import { useReactiveVar } from "@apollo/client";
import { socketVar, userVar } from "../../apollo/store";
import { Member } from "../types/member/member";
import { Messages, REACT_APP_API_URL } from "../config";
import { sweetErrorAlert } from "../sweetAlert";

const NewMessage = (type: any) => {
  if (type === "right") {
    return (
      <Box
        component={"div"}
        flexDirection={"row"}
        style={{ display: "flex" }}
        alignItems={"flex-end"}
        justifyContent={"flex-end"}
        sx={{ m: "10px 0px" }}
      >
        <div className={"msg_right"}></div>
      </Box>
    );
  } else {
    return (
      <Box
        flexDirection={"row"}
        style={{ display: "flex" }}
        sx={{ m: "10px 0px" }}
        component={"div"}
      >
        <Avatar alt={"jonik"} src={"/img/profile/defaultUser.svg"} />
        <div className={"msg_left"}></div>
      </Box>
    );
  }
};

interface MessagePayload {
  event: string;
  text: string;
  memberData: Member | null | undefined;
}

interface InfoPayload {
  event: string;
  totalClients: number;
  memberData: Member | null | undefined;
  action: string;
}

const Chat = () => {
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const textInput = useRef(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const socket = useReactiveVar(socketVar);

  /** LIFECYCLES **/

  useEffect(() => {
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      switch (data.event) {
        case "info":
          const newInfo: InfoPayload = data;
          setOnlineUsers(newInfo.totalClients);
          break;
        case "getMessages":
          const list: MessagePayload[] = data.list;
          setMessagesList(list);
          break;
        case "message":
          const newMessage: MessagePayload = data;
          messagesList.push(newMessage);
          setMessagesList([...messagesList]);
          break;
      }
    };
  }, [socket, messagesList]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOpenButton(true);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setOpenButton(false);
  }, [router.pathname]);

  /** HANDLERS **/
  const handleOpenChat = () => {
    setOpen((prevState) => !prevState);
  };

  const getInputMessageHandler = useCallback(
    (e: any) => {
      const text = e.target.value;
      setMessageInput(text);
    },
    [messageInput]
  );

  const getKeyHandler = (e: any) => {
    try {
      if (e.key == "Enter") {
        onClickHandler();
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const onClickHandler = () => {
    if (!messageInput) {
      sweetErrorAlert(Messages.error4);
    } else {
      socket.send(JSON.stringify({ event: "message", data: messageInput }));
      setMessageInput("");
    }
  };

  return (
    <div>
      {openButton ? (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff5a73] text-white shadow-lg transition hover:bg-fuchsia-900 cursor-pointer"
          aria-label="Open chat"
        >
          {open ? (
            <CloseFullscreenIcon fontSize="small" />
          ) : (
            <MarkChatUnreadIcon fontSize="small" />
          )}
        </button>
      ) : null}

      <div
        className={`fixed bottom-24 right-6 z-50 w-80 transform rounded-xl border border-gray-200 bg-white shadow-xl transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 sm:w-96 ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "pointer-events-none opacity-0 translate-y-2 scale-95"
        }`}
        role="dialog"
        aria-label="Chat window"
      >
        <div className="flex items-center justify-between bg-gray-100 px-3 py-2 text-sm font-semibold dark:bg-neutral-800">
          <div className="text-foreground">Online Chat</div>
          <button
            onClick={handleOpenChat}
            className="rounded p-1 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close chat"
          >
            <CloseFullscreenIcon fontSize="small" />
          </button>
        </div>

        <div
          id="chat-content"
          ref={chatContentRef}
          className="h-72 overflow-y-auto p-3"
        >
          <ScrollableFeed>
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="text-xs text-muted-foreground">
                  Welcome to Live chat!
                </div>
              </div>
              {messagesList.map((ele: MessagePayload, idx: number) => {
                const { text, memberData } = ele;
                const memberPhoto = memberData?.memberImage
                  ? `${REACT_APP_API_URL}/${memberData?.memberImage}`
                  : "/img/profile/defaultUser.svg";

                if (memberData?._id === user._id) {
                  return (
                    <div key={idx} className="flex justify-end">
                      <div className="max-w-[75%] rounded-2xl bg-blue-600 px-3 py-2 text-sm text-white">
                        {text}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="flex items-end gap-2">
                    <Avatar
                      alt={"avatar"}
                      src={memberPhoto}
                      sx={{ width: 28, height: 28 }}
                    />
                    <div className="max-w-[75%] rounded-2xl bg-gray-100 px-3 py-2 text-sm text-foreground dark:bg-neutral-800">
                      {text}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollableFeed>
        </div>

        <div className="flex items-center gap-2 border-t border-gray-200 p-2 dark:border-neutral-800">
          <input
            ref={textInput}
            type="text"
            name="message"
            className="h-10 flex-1 rounded-md border border-gray-300 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none dark:border-neutral-700"
            value={messageInput}
            placeholder={"Type message"}
            onChange={getInputMessageHandler}
            onKeyDown={getKeyHandler}
          />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={onClickHandler}
            aria-label="Send message"
          >
            <SendIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
