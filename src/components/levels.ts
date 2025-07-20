import { TRANSLATIONS } from './translations';

const appLocale = '{{APP_LOCALE}}';
const browserLocale = typeof navigator !== 'undefined' ? (navigator.languages?.[0] || navigator.language || 'en-US') : 'en-US';

const findMatchingLocale = (locale: string) => {
    if (TRANSLATIONS[locale]) return locale;
    const lang = locale.split('-')[0];
    const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
    return match || 'en-US';
};

const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key: string) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

export interface Level {
    id: number;
    title: string;
    description: string;
    concept: string;
    task: string;
    starterCode: string;
    expectedOutput: string;
    hint: string;
    solution: string;
}

export const levels: Level[] = [
    {
        id: 1,
        title: t('helloWorldTitle'),
        description: t('helloWorldDescription'),
        concept: t('helloWorldConcept'),
        task: t('helloWorldTask'),
        starterCode: t('starterCodeComment'),
        expectedOutput: "Hello, World!",
        hint: t('helloWorldHint'),
        solution: "print('Hello, World!')"
    },
    {
        id: 2,
        title: t('variablesNumbersTitle'),
        description: t('variablesNumbersDescription'),
        concept: t('variablesNumbersConcept'),
        task: t('variablesNumbersTask'),
        starterCode: t('createVariableComment'),
        expectedOutput: "25",
        hint: t('variablesNumbersHint'),
        solution: "age = 25\nprint(age)"
    },
    {
        id: 3,
        title: t('stringVariablesTitle'),
        description: t('stringVariablesDescription'),
        concept: t('stringVariablesConcept'),
        task: t('stringVariablesTask'),
        starterCode: t('createStringComment'),
        expectedOutput: "Hello, Python!",
        hint: t('stringVariablesHint'),
        solution: "name = 'Python'\nprint(f'Hello, {name}!')"
    },
    {
        id: 4,
        title: t('userInputTitle'),
        description: t('userInputDescription'),
        concept: t('userInputConcept'),
        task: t('userInputTask'),
        starterCode: t('getUserInputComment'),
        expectedOutput: "Your favorite color is blue",
        hint: t('userInputHint'),
        solution: "color = input('What is your favorite color? ')\nprint(f'Your favorite color is {color}')"
    },
    {
        id: 5,
        title: t('basicMathTitle'),
        description: t('basicMathDescription'),
        concept: t('basicMathConcept'),
        task: t('basicMathTask'),
        starterCode: t('calculateSumComment'),
        expectedOutput: "42",
        hint: t('basicMathHint'),
        solution: "print(15 + 27)",
    },
    {
        id: 6,
        title: t('conditionalsTitle'),
        description: t('conditionalsDescription'),
        concept: t('conditionalsConcept'),
        task: t('conditionalsTask'),
        starterCode: t('useIfStatementComment'),
        expectedOutput: "Yes, 10 is greater than 5",
        hint: t('conditionalsHint'),
        solution: "number = 10\nif number > 5:\n    print('Yes, 10 is greater than 5')"
    },
    {
        id: 7,
        title: t('forLoopsTitle'),
        description: t('forLoopsDescription'),
        concept: t('forLoopsConcept'),
        task: t('forLoopsTask'),
        starterCode: t('useForLoopComment'),
        expectedOutput: "1\n2\n3",
        hint: t('forLoopsHint'),
        solution: "for i in range(1, 4):\n    print(i)"
    },
    {
        id: 8,
        title: t('whileLoopsTitle'),
        description: t('whileLoopsDescription'),
        concept: t('whileLoopsConcept'),
        task: t('whileLoopsTask'),
        starterCode: t('useWhileLoopComment'),
        expectedOutput: "1\n2\n3",
        hint: t('whileLoopsHint'),
        solution: "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1"
    },
    {
        id: 9,
        title: t('listsBasicsTitle'),
        description: t('listsBasicsDescription'),
        concept: t('listsBasicsConcept'),
        task: t('listsBasicsTask'),
        starterCode: t('createListComment'),
        expectedOutput: "banana",
        hint: t('listsBasicsHint'),
        solution: "fruits = ['apple', 'banana', 'orange']\nprint(fruits[1])"
    },
    {
        id: 10,
        title: t('listOperationsTitle'),
        description: t('listOperationsDescription'),
        concept: t('listOperationsConcept'),
        task: t('listOperationsTask'),
        starterCode: t('createListAddComment'),
        expectedOutput: "[1, 2, 3, 4]",
        hint: t('listOperationsHint'),
        solution: "numbers = [1, 2, 3]\nnumbers.append(4)\nprint(numbers)"
    },
    {
        id: 11,
        title: t('functionsBasicsTitle'),
        description: t('functionsBasicsDescription'),
        concept: t('functionsBasicsConcept'),
        task: t('functionsBasicsTask'),
        starterCode: t('defineFunctionComment'),
        expectedOutput: "Hello!",
        hint: t('functionsBasicsHint'),
        solution: "def greet():\n    print('Hello!')\n\ngreet()"
    },
    {
        id: 12,
        title: t('functionsParametersTitle'),
        description: t('functionsParametersDescription'),
        concept: t('functionsParametersConcept'),
        task: t('functionsParametersTask'),
        starterCode: t('functionParameterComment'),
        expectedOutput: "Hello, World!",
        hint: t('functionsParametersHint'),
        solution: "def say_hello(name):\n    print(f'Hello, {name}!')\n\nsay_hello('World')"
    },
    {
        id: 13,
        title: t('dictionariesTitle'),
        description: t('dictionariesDescription'),
        concept: t('dictionariesConcept'),
        task: t('dictionariesTask'),
        starterCode: t('createDictionaryComment'),
        expectedOutput: "Alice",
        hint: t('dictionariesHint'),
        solution: "person = {'name': 'Alice', 'age': 30}\nprint(person['name'])"
    },
    {
        id: 14,
        title: t('stringMethodsTitle'),
        description: t('stringMethodsDescription'),
        concept: t('stringMethodsConcept'),
        task: t('stringMethodsTask'),
        starterCode: t('stringMethodsComment'),
        expectedOutput: "PYTHON PROGRAMMING",
        hint: t('stringMethodsHint'),
        solution: "text = 'python programming'\nprint(text.upper())"
    },
    {
        id: 15,
        title: t('finalChallengeTitle'),
        description: t('finalChallengeDescription'),
        concept: t('finalChallengeConcept'),
        task: t('finalChallengeTask'),
        starterCode: t('finalChallengeComment'),
        expectedOutput: "2\n4\n6\n8\n10",
        hint: t('finalChallengeHint'),
        solution: "numbers = [1, 2, 3, 4, 5]\nfor num in numbers:\n    print(num * 2)"
    }
];