import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import { JavaScriptLogo } from './JavaScritLogo';
import { HtmlLogo } from './HtmlLogo';
import { CssLogo } from './CssLogo';
import language from 'react-syntax-highlighter/dist/esm/languages/hljs/1c';
import { useQuestionStore } from '../store/question';
import { ReactLogo } from './ReactLogo';
import { AngularLogo } from './AngularLogo';

type Language = {
  id: number;
  name: string;
  fileName: string;
  language: typeof language;
  svg: () => JSX.Element;
};

const LANGUAGES: Language[] = [
  {
    id: 1,
    name: 'JavaScript',
    language: 'javascript',
    fileName: 'javascript',
    svg: JavaScriptLogo,
  },
  {
    id: 2,
    name: 'HTML',
    language: 'html',
    fileName: 'html',
    svg: HtmlLogo,
  },
  {
    id: 3,
    name: 'CSS',
    language: 'css',
    fileName: 'css',
    svg: CssLogo,
  },
  {
    id: 4,
    name: 'React',
    language: 'jsx',
    fileName: 'react',
    svg: ReactLogo,
  },
  {
    id: 5,
    name: 'Angular',
    language: 'typescript',
    fileName: 'angular',
    svg: AngularLogo,
  },
];

export const LanguageSelect = () => {
  const selectLanguage = useQuestionStore(
    ({ selectLanguage }) => selectLanguage
  );
  const createHandledClick = (
    language: string,
    fileName: string,
    tecnologie: string
  ) => selectLanguage(language, fileName, tecnologie);
  return (
    <>
      <List disablePadding sx={{ bgcolor: '#333' }}>
        {LANGUAGES.map((lang) => (
          <ListItem key={lang.id} disablePadding divider>
            <ListItemButton
              onClick={() =>
                createHandledClick(lang.language, lang.fileName, lang.name)
              }
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                {lang.svg()}
                <ListItemText
                  primary={lang.name}
                  sx={{ textAlign: 'center' }}
                />
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};
