import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

export const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <Heading as="h1" size="xl" mb={4}>
            {children}
          </Heading>
        ),
        h2: ({ children }) => (
          <Heading as="h2" size="lg" mt={6} mb={2}>
            {children}
          </Heading>
        ),
        h3: ({ children }) => (
          <Heading as="h3" size="md" mt={4} mb={2}>
            {children}
          </Heading>
        ),
        p: ({ children }) => <Text mb={2}>{children}</Text>,
        table: ({ children }) => (
          <Table variant="striped" size="sm" mt={4}>
            {children}
          </Table>
        ),
        thead: ({ children }) => <Thead>{children}</Thead>,
        tbody: ({ children }) => <Tbody>{children}</Tbody>,
        tr: ({ children }) => <Tr>{children}</Tr>,
        th: ({ children }) => (
          <Th textAlign="left" fontWeight="bold">
            {children}
          </Th>
        ),
        td: ({ children }) => <Td>{children}</Td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
