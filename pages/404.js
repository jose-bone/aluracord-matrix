import { Box, Image } from "@skynexui/components";
import appConfig from "../config.json";
import Title from "../src/components";

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
        <Image src="/404.gif" alt="Page Not Found" />
        {/* <Title tag="h1" color="800">
          404... Not Found!!
        </Title> */}
      </Box>
    </>
  );
}
