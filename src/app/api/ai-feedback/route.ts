import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Check if API key is available
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Fallback responses for common Python mistakes
const getFallbackResponse = (userCode: string, expectedOutput: string, task: string) => {
  
  // Hello World variations
  if (userCode.includes('print(') && (userCode.includes('Hi there') || userCode.includes('hi there'))) {
    return {
      feedback: "Excellent! You're using the print() function correctly. You just need to change the text inside the quotes to match exactly what's asked for.",
      correctCode: `print('Hello, World!')`,
      explanation: "The print() function displays text on the screen. To get 'Hello, World!', simply change the text inside the quotes.",
      tip: "Always verify that the text matches the expected output exactly, including capitalization and punctuation."
    };
  }

  // Variables - missing print
  if (userCode.includes('age = 25') && !userCode.includes('print(age)')) {
    return {
      feedback: "Great job creating the variable! Now you need to display its value using print().",
      correctCode: `age = 25\nprint(age)`,
      explanation: "First you create the variable 'age = 25', then use 'print(age)' to display its value.",
      tip: "Remember that creating a variable doesn't automatically display it. You need to use print() to see it."
    };
  }

  // Math operations
  if (userCode.includes('15 + 27') && !userCode.includes('print(')) {
    return {
      feedback: "Perfect! You have the math operation right. You just need to use print() to show the result.",
      correctCode: `print(15 + 27)`,
      explanation: "Python can calculate 15 + 27, but you need print() to see the result on the screen.",
      tip: "Use print() around math operations to see the results."
    };
  }

  // Generic fallback based on expected output
  let correctCode = "";
  if (expectedOutput === "Hello, World!") {
    correctCode = "print('Hello, World!')";
  } else if (expectedOutput === "25") {
    correctCode = "age = 25\nprint(age)";
  } else if (expectedOutput === "42") {
    correctCode = "print(15 + 27)";
  }

  return {
    feedback: "Keep trying! Your code is on the right track. Check the hint and example for more guidance.",
    correctCode: correctCode,
    explanation: "Compare your code with the expected output and adjust as needed. Use the hint as a guide.",
    tip: "Break the problem into small steps: what do you need to do? How do you do it in Python?"
  };
};

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { userCode, expectedOutput, task, hint } = requestData;

    if (!userCode || !expectedOutput || !task) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!apiKey || !genAI) {
      console.log('Gemini API key not available, using fallback response');
      const fallbackResponse = getFallbackResponse(userCode, expectedOutput, task);
      return NextResponse.json(fallbackResponse);
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        }
      });

      const prompt = `You are a helpful Python programming tutor for beginners. A student is learning Python and submitted incorrect code.

TASK: ${task}
EXPECTED OUTPUT: ${expectedOutput}
STUDENT'S CODE:
${userCode}

HINT AVAILABLE: ${hint}

Please provide feedback in English that:
1. Is encouraging and supportive (don't say "wrong" or "incorrect")
2. Explains what their code currently does
3. Guides them toward the correct solution step by step
4. Shows the correct code if needed
5. Uses simple, beginner-friendly language
6. Is specific to their mistake

Respond with a JSON object in this exact format:
{
  "feedback": "Your encouraging explanation here",
  "correctCode": "the correct Python code here",
  "explanation": "step-by-step explanation of the solution",
  "tip": "a helpful tip for similar problems"
}

Remember: Be encouraging, educational, and specific to their code!`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const aiResponse = response.text();

      try {
        // Clean the response to extract JSON
        let cleanResponse = aiResponse.trim();
        
        // Remove markdown code blocks if present
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        const parsedResponse = JSON.parse(cleanResponse);
        return NextResponse.json(parsedResponse);
      } catch (parseError) {
        console.log('JSON parsing failed, using fallback response');
        const fallbackResponse = getFallbackResponse(userCode, expectedOutput, task);
        return NextResponse.json(fallbackResponse);
      }

    } catch (aiError) {
      console.error('Gemini API error:', aiError);
      
      // Use fallback response if AI fails
      const fallbackResponse = getFallbackResponse(userCode, expectedOutput, task);
      return NextResponse.json(fallbackResponse);
    }

  } catch (error) {
    console.error('AI Feedback error:', error);

    // Always provide a helpful fallback response
    return NextResponse.json({
      feedback: "Don't give up! Review your code and compare it with the expected output. You can do this!",
      correctCode: "",
      explanation: "Use the available hint to guide you toward the correct solution.",
      tip: "Practice makes perfect. Keep trying and you'll learn!"
    });
  }
}