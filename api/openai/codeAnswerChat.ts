import openai from "./open-ai.config";

export default async function codeAnswerChat(content: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `We're playing the Guess the Code Output game. Your task is to evaluate a code snippet and compare the output provided by the user in JSON format. Respond with a JSON object indicating whether the user's output is correct or wrong for the given code snippet. The user's message will be in the format: {"code": "code_snippet", "output": "user_guess_for_code_snippet_output"}. Your response should be either {"correct": "Correct! You're doing a great job!"} or {"wrong": "Oops! Your answer is not correct, maybe try again?"}. Analyze the code and user-provided output carefully for accurate responses.`,
      },
      {
        role: "user",
        content:
          '{"code": "function sumArray(arr) {\n  return arr.reduce((total, num) => total + num, 0);\n}\n\nconst numbers = [1, 2, 3, 4, 5];\nconsole.log(sumArray(numbers));", "output": "15"}',
      },
      {
        role: "assistant",
        content: '{"correct": "Correct! Nicely done!"}',
      },
      {
        role: "user",
        content:
          '{"code": "function sumArray(arr) {\n  return arr.reduce((total, num) => total + num, 0);\n}\n\nconst numbers = [1, 2, 3, 4, 5];\nconsole.log(sumArray(numbers));", "output": "14"}',
      },
      {
        role: "assistant",
        content:
          '{"wrong": "Oops! Your answer is not correct, maybe try again?"}',
      },
      { role: "user", content },
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });

  return completion;
}
