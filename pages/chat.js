import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";

export default function ChatPage() {
  const [message, setMessage] = React.useState("");
  const [listedMessages, setListedMessages] = React.useState([]);

  function handleNewMessage(newMessage) {
    if (newMessage.length >= 1) {
      const message = {
        id: listedMessages.length + 1,
        from: "jose-bone",
        text: newMessage,
      };
      setListedMessages([message, ...listedMessages]);
      setMessage("");
    }
  }

  // função para deletar mensagem da lista
  function handleDeleteMessage(actualMessage) {
    // id da msg
    const id = actualMessage.id;
    // lista filtrada
    const messagesListFiltered = listedMessages.filter((message) => {
      return message.id != id;
    });
    setListedMessages(messagesListFiltered);
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          opacity: "0.9",
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: { xs: "8px", md: "32px" },
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: { xs: "8px", md: "24px" },
          }}
        >
          <MessageList
            messages={listedMessages}
            setListedMessages={setListedMessages}
          />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNewMessage(message);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: { xs: "8px", md: "16px" },
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              size="lg"
              variant="primary"
              colorVariant="dark"
              label={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-send"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              }
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.neutrals[800],
                mainColorLight: appConfig.theme.colors.neutrals[900],
                mainColorStrong: appConfig.theme.colors.neutrals[900],
              }}
              styleSheet={{
                borderRadius: "5px",
              }}
              onClick={(event) => {
                // retirar o comportamento padrão do enter (quebrar uma linha)
                event.preventDefault();
                // função pra enviar a msg
                handleNewMessage(message);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  function removeMessage(id) {
    //console.log(id) ta saindo o id que eu clico
    const removedMessage = props.messages.filter(
      (message) => id !== message.id
    );
    //console.log(mensagemRemovida) ta saindo o novo array com valores excluidos
    props.setListedMessages(removedMessage);
  }

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.messages.map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                styleSheet={{
                  marginBottom: "8px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  styleSheet={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  src={`https://github.com/jose-bone.png`}
                  alt="Perfil do Usuário"
                />
                <Text tag="strong">{message.from}</Text>
                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {new Date().toLocaleDateString()}
                </Text>
              </Box>
              <Button
                /* botão para excluir a mensagem */
                styleSheet={{
                  borderRadius: "25%",
                  width: "15px",
                  marginLeft: "15px",
                  color: "#FF4760",
                }}
                variant="tertiary"
                colorVariant="dark"
                label={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-trash"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                }
                buttonColors={{
                  mainColor: appConfig.theme.colors.neutrals["000"],
                }}
                // quando clicar vai chamar a função de excluir a mensagem
                onClick={(event) => {
                  event.preventDefault();
                  removeMessage(message.id);
                }}
              />
            </Box>
            {message.text}
          </Text>
        );
      })}
    </Box>
  );
}
