import { Box, Text, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { LANGUAGES } from "../constants"; // Assuming the file path for constants.js is correct

export default function LanguageSelector({ language,onSelect}) {
  return (
    <Box color={"black"}>
      <Text mb={2} fontSize='lg'></Text>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  { language}
        </MenuButton>
        <MenuList>
          {Object.keys(LANGUAGES).map((language) => (
              <MenuItem key={language} onClick={() => { onSelect(language)}}>
              {LANGUAGES[language].name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}
