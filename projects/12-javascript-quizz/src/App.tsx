import { Container, Stack, Typography } from '@mui/material';
import './App.css';
import { JavaScriptLogo } from './components/JavaScritLogo';
import { Start } from './components/Start';
import { useQuestionStore } from './store/question';
import { Game } from './components/Game';

function App() {
  const questions = useQuestionStore((state) => state.questions);
  console.log(questions);
  return (
    <main>
      <Container maxWidth="sm">
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <JavaScriptLogo />
          <Typography variant="h2" component="h1">
            JavaScript Quizz
          </Typography>
        </Stack>
        {questions.length ? <Game /> : <Start />}
      </Container>
    </main>
  );
}

export default App;
