"use client";

import { useEffect, useState } from "react";
import { Spinner, Box, Text, VStack } from "@chakra-ui/react";
import { loadingPhrases } from "../utils/data/loadingPhrases";

export default function FunnyLoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <VStack
      spacing={4}
      align="center"
      justify="center"
      height="30vh"
      textAlign="center"
      mt={6}
    >
      <Spinner size="lg" thickness="4px" speed="0.65s" color="blue.400" />
      <Box maxW="sm">
        <Text fontSize="lg" fontWeight="medium">
          {loadingPhrases[index]}
        </Text>
      </Box>
    </VStack>
  );
}
