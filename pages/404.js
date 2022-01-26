import { Box, Image, Text } from "@skynexui/components";
import appConfig from "../config.json";
import Title from "../components";

export default function PageNotFound() {
  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundColor: appConfig.theme.colors.neutrals[100],
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Image src="/matrix.png" alt="Imagem de Matrix" />
        <Title tag="h1" color="800">
          404... Chat Errado!
        </Title>
      </Box>
    </>
  );
}
