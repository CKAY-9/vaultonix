"use client";

import { getTrivia } from "@/api/vaultonix/vaultonix.api";
import { TriviaDTO, TriviaQuestionDTO } from "@/api/vaultonix/vaultonix.dto";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./trivia.module.scss";

const Question = (props: { question: TriviaQuestionDTO }) => {
  const [prompt, setPrompt] = useState<string>(props.question.prompt);
  const [answers, setAnswers] = useState<string[]>(props.question.answers);
  const [correct_answer, setCorrectAnswer] = useState<number>(
    props.question.correct_answer
  );

  return (
    <div className={style.question}>
      <section>
        <label>Prompt</label>
        <input
          type="text"
          placeholder="Question Prompt"
          onChange={(e: BaseSyntheticEvent) => setPrompt(e.target.value)}
        />
      </section>
      {answers.map((answer, index) => {
        return (
          <section key={index}>
            <button onClick={() => setCorrectAnswer(index)} style={{"backgroundColor": index === correct_answer ? "var(--accent-400)" : "var(--primary-700)"}}>Answer #{index + 1}</button>
            <input onChange={(e: BaseSyntheticEvent) => {
              answers[index] = e.target.value;
              setAnswers(answers);
            }} type="text" placeholder={`Answer #${index + 1}`} />
          </section>
        );
      })}
      {answers.length >= 1 && (
        <span style={{ opacity: "0.5" }}>
          (Click which question is the right one)
        </span>
      )}
      <button style={{"width": "fit-content"}} onClick={() => setAnswers((old) => [...old, ""])}>Add Answer</button>
      <section>
        <label>Credits Reward</label>
        <input type="number" min={0} max={100_000_000} placeholder="Credits" />
      </section>
    </div>
  );
};

export const TriviaModule = (props: { guild_id: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [trivia, setTrivia] = useState<TriviaDTO | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestionDTO[]>([]);

  useEffect(() => {
    (async () => {
      const t = await getTrivia(props.guild_id);
      if (t === null) return;

      const parsed_questions = JSON.parse(t.questions);
      setTrivia(t);
      setQuestions(parsed_questions);
      setLoading(false);
    })();
  }, [props.guild_id]);

  if (trivia === null || loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <>
      <h3>Trivia Bot</h3>
      <span>Reward users for getting correct answers to Trivia questions</span>
      {questions.length <= 0 && <span>You have no questions setup...</span>}
      {questions.map((question, index) => {
        return <Question key={index} question={question} />;
      })}
      <button
        onClick={() => {
          setQuestions((old) => [
            ...old,
            {
              answers: [],
              prompt: "",
              credits_reward: 0,
              correct_answer: 0,
            },
          ]);
        }}
      >
        New Question
      </button>
      <button>Update</button>
    </>
  );
};

export default TriviaModule;
