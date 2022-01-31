import React from "react";
import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { ThreeDots } from "react-loading-icons";
import { useRouter } from "next/router";

// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
);

export default function ChatPage() {
  // passar para conseguir pegar o nome do user que fez o login
  const router = useRouter();
  const { username } = router.query;

  const [message, setMessage] = React.useState("");
  const [listedMessages, setListedMessages] = React.useState([]);

  // useState para o loading
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabaseClient
      .from("messages")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        console.log("Dados da consulta: ", data);
        if (data != null) {
          setListedMessages(data);
        }
        setLoading(false);
      });

    listenMessageInRealTime((newMessage) => {
      // ele que seta a nova mensagem na lista do use state
      // pega so a nova mensagem e insere na lista
      setListedMessages((valorAtualLista) => {
        // se não for com a função, ele não pega o valor atualizado da lista
        return [newMessage, ...valorAtualLista];
      });
    });
  }, []);

  function handleNewMessage(newMessage) {
    const message = {
      from: username,
      text: newMessage,
    };

    supabaseClient
      .from("messages")
      .insert([message])
      .then(({ data }) => {
        console.log("Criando mensagem: ", data);
        setListedMessages([data[0], ...listedMessages]);
      });

    setMessage("");
  }

  function handleDeleteMessage(actualMessage) {
    // excluir a mensagem primeiro no supabase e depois no useState
    supabaseClient
      .from("messages")
      .delete()
      .match({ id: actualMessage.id })
      .then(({ data }) => {
        // lista filtrada
        const messagesListFiltered = listedMessages.filter((message) => {
          return message.id != data[0].id;
        });
        setListedMessages(messagesListFiltered);
      });
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
          opacity: "0.92",
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
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
            padding: "16px",
          }}
        >
          {loading ? (
            <Box
              styleSheet={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <ThreeDots
                fill={appConfig.theme.colors.neutrals[800]}
                height="16px"
              />
            </Box>
          ) : (
            <MessageList
              messages={listedMessages}
              handleDeleteMessage={handleDeleteMessage}
            />
          )}

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextField
              value={message}
              onChange={(event) => {
                const valor = event.target.value;
                setMessage(valor);
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
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNewMessage(`:sticker: ${sticker}`);
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
  const handleDeleteMessage = props.handleDeleteMessage;

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        overflowX: "hidden",
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
                position: "relative",
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
                    hover: {
                      transform: "scale(2.5)",
                      marginLeft: "20px",
                      marginRight: "20px",
                    },
                  }}
                  src={`https://github.com/${message.from}.png`}
                  alt=""
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
                  handleDeleteMessage(message);
                }}
              />
            </Box>
            {message.text.startsWith(":sticker:") ? (
              <Image
                src={message.text.replace(":sticker:", "")}
                alt=""
                styleSheet={{
                  width: "120px",
                }}
              />
            ) : (
              message.text
            )}
          </Text>
        );
      })}
    </Box>
  );
}
