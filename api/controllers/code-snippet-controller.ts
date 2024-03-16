import asyncHandler from 'express-async-handler';
import codeSnippetChat from '../openai/codeSnippetChat';
import codeAnswerChat from '../openai/codeAnswerChat';

// @desc    Generate a code snippet with open ai
// @route   GET /api/code-snippet
// @access  Public
exports.getCodeSnippet = asyncHandler(async (req, res, next) => {
  const language = req.query['language'] as string;
  const level = req.query['level'] as string;
  const content = `Provide a unique code snippet in ${language} with a complexity level of ${level}`;

  const chat = await codeSnippetChat(content);
  const chatContent = chat.choices[0].message.content;

  if (!chatContent) {
    return next(new Error('Internal server error'));
  }

  const codeSnippet = JSON.parse(chat.choices[0].message.content as string);
  res.status(200).json(codeSnippet);
});

// @desc    Verify if the code output is correct
// @route   POST /api/code-snippet
// @access  Public
exports.verifyCodeOutput = asyncHandler(async (req, res, next) => {
  const codeAnswer = JSON.stringify(req.body.answer);

  const chat = await codeAnswerChat(codeAnswer);
  const chatContent = JSON.parse(chat.choices[0].message.content as string);

  if (!chatContent) {
    return next(new Error('Internal server error'));
  }

  const chatResponse = JSON.parse(chat.choices[0].message.content as string);

  res.status(200).json(chatResponse);
});
