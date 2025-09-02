"use client";

import { Flex, Heading, Text, Icon, Divider } from "@chakra-ui/react";
import { mdiSpeedometer } from "@mdi/js";
import PageDetails from "./components/PageDetails";

export default function Home() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="top"
      minH="100vh"
      bg="gray.50"
      p={4}
    >
      <Flex
        align="center"
        bg="purple.400"
        p={4}
        rounded="md"
        shadow="md"
        gap={2}
        direction={{ base: "column" }}
        width={"80%"}
      >
        <Heading as="h1" mb={4} size="lg" color="white" textAlign="center">
          <Flex align="center">
            <Icon viewBox="0 0 24 24" color="white" w={6} h={6} mr={2}>
              <path d={mdiSpeedometer} fill="currentColor" />
            </Icon>
            <Text mr={2}>Google PageSpeed Insights AI Analysis</Text>
          </Flex>
        </Heading>
        <Divider mb={4} bg={"white"} />

        <Text fontSize="md" color="white" textAlign="center">
          Analyze the seo and performance metrics of the Sitecore page using
          Google PageSpeed Insights and OpenAI.
        </Text>
      </Flex>

      <PageDetails />
    </Flex>
  );
}
