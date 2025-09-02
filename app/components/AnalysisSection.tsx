import { Flex, Heading, Icon } from "@chakra-ui/react";

export const AnalysisSection = ({
  title,
  iconPath,
  children,
}: {
  title: string;
  iconPath: string;
  children: React.ReactNode;
}) => (
  <Flex direction="column" gap={2}>
    <Flex align="center" gap={2}>
      <Icon viewBox="0 0 24 24" color="purple.400" w={5} h={5}>
        <path d={iconPath} fill="currentColor" />
      </Icon>
      <Heading as="h2" size="m" color="purple.400">
        {title}
      </Heading>
    </Flex>
    {children}
  </Flex>
);
