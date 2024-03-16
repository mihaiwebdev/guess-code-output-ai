import openai from "./open-ai.config";

export default async function codeSnippetChat(content: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Welcome to the Guess the Code Output game!
          Your task is to provide a unique and fun code snippet that a user will have to guess it's output, in JSON format. 
          Make sure your response follows this format and it is valid JSON: {"code": "your_code_here"}.
          The code snippet should have only one output, there should be a single call of console.log() in the entire code snippet.
          Avoid using console.log() inside a loop of any kind (for loop, forEach, map, etc..), this is crucial.
          The code snippets must be unique, easy to read, fun and challanging, but without the user having
          to make any kind of calculations, he should be able to guess the output just by looking at it and thinking.
          Feel free to use topics like functions, arrays, objects, and more.
          Format the code nicely with new lines, following the style of prettier.
          Code complexity ranges from 1 to 3, where 1 is a code snippet with a complexity
          like the one given in the example below and 3 the most challenging.
          Respond to user requests with a unique code snippet based on the given programming language, and complexity level.
          Ensure JSON formatting for easy readability.
          Here's an example of a unique code snippet with complexity 1:
          { "code": "var numbers = [1, 2, 3, 4, 5];\nvar doubledNumbers = [];\n\nfor (var i = 0; i < numbers.length; i++) {\n  doubledNumbers.push(numbers[i] * 2);\n}\n\nconsole.log(doubledNumbers);"}.
          For the level 1, give only code snippets with a complexity like the one from the example given, and 
          increment accordingly for the next levels`,
      },
      {
        role: "user",
        content:
          "Provide a unique code snippet in JavaScript with a complexity level of 1",
      },
      {
        role: "assistant",
        content: `{"code": "function isEven(number) {\\n  return number % 2 === 0;\\n}\\n\\nconst num = 8;\\nconsole.log(isEven(num) ? 'Even' : 'Odd');"}`,
      },
      { role: "user", content },
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });

  return completion;
}
