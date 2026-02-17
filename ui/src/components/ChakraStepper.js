import { Box, Flex, Text } from "@chakra-ui/react"


export default function ChakraStepper(props) {

  return (
    <Flex direction="column" gap={2}>
      {props.steps.map((step, index) => (
        <Flex 
          key={index} 
          align="center" 
          gap={3}
          opacity={index <= props.activeStep ? 1 : 0.5}
        >
          <Flex
            w="30px"
            h="30px"
            borderRadius="full"
            bg={index <= props.activeStep ? "orange.500" : "gray.300"}
            color="white"
            align="center"
            justify="center"
            fontSize="sm"
            fontWeight="bold"
          >
            {index + 1}
          </Flex>
          
          <Box flexShrink='0'>
            <Text fontWeight="bold" fontSize="sm" color={index <= props.activeStep ? "gray.700" : "gray.500"}>
              {step.title}
            </Text>
            {step._description && (
              <Text fontSize="xs" color="gray.500">
                {step._description}
              </Text>
            )}
          </Box>
        </Flex>
      ))}
    </Flex>
  )
}
