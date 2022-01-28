import React, { useEffect } from "react";
import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import { useRouter } from "next/router";
import appConfig from "../config.json";
import defaultImage from "../public/matrix.png";

function Title(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals["000"]};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default function HomePage() {
  const [username, setUsername] = React.useState("");
  const roteamento = useRouter();
  const [githubUser, setGithubUser] = React.useState("");

  useEffect(() => {
    fetch(username ? `https://api.github.com/users/${username}` : "")
      .then((resposta) => {
        if (!resposta.ok) {
          throw Error("Não foi possível fazer a requisição");
        }
        return resposta.json();
      })
      .then((data) => {
        setGithubUser(data);
      })
      .catch((erro) => {
        console.log(erro.message);
      });
  }, []);

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage:
            "url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
            opacity: "0.94",
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (event) {
              event.preventDefault();
              // console.log("Clicou!");
              roteamento.push(`/chat?username=${username}`);
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Title tag="h2">Boas vindas de volta!</Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              placeholder="Escreva seu username do GitHub"
              value={username}
              onChange={function (event) {
                // Onde está o valor?
                const valor = event.target.value;
                //Trocar o valor da variável
                // através do e avise quem precisa
                setUsername(valor);
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
              onChange={(event) => {
                // Onde está o valor?
                const valor = event.target.value;

                // validar se existe o usuário e pegar a sua foto
                fetch(`${apiGithub}${valor}`, { method: "GET" }).then(
                  (retorno) => {
                    // se existir vai pegar a foto e por o nome no username
                    if (retorno.status === 200) {
                      console.log("user existe 200");
                      // Trocar o valor da username
                      setUsername(valor);
                      setNameImg(valor);
                      // Trocar o valor do userImg
                      setUserImg(`${gitURL}.png`);
                    } else if (retorno.status === 404) {
                      setNameImg("User não existe");
                      setUserImg(
                        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4tBbzVZlIvgshAFiNpeCsuFW-UE3dZpnIxQ&usqp=CAU`
                      );
                    }
                  }
                );
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
              }}
              src={
                username
                  ? `https://github.com/${username}.png`
                  : defaultImage.src
              }
              alt="Imagem de Perfil"
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
