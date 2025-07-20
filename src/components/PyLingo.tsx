'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Lightbulb, CheckCircle, Lock, Trophy, Flame } from 'lucide-react';
import { TRANSLATIONS } from './translations';
import { levels } from './levels';

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

const PyLingo = () => {
  // State management
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userCode, setUserCode] = useState(levels[0].starterCode);
  const [completedLevels, setCompletedLevels] = useState(new Set<number>());
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [showLevelSelector, setShowLevelSelector] = useState(false);

  // Load progress from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('pylingo-progress');
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          setCompletedLevels(new Set(progress.completedLevels || []));
          setStreak(progress.streak || 0);
          setCurrentLevel(progress.currentLevel || 1);
        } catch (error) {
          console.error('Error loading progress:', error);
        }
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = {
        completedLevels: Array.from(completedLevels),
        streak,
        currentLevel
      };
      localStorage.setItem('pylingo-progress', JSON.stringify(progress));
    }
  }, [completedLevels, streak, currentLevel]);

  // Update user code when level changes
  useEffect(() => {
    const level = levels.find(l => l.id === currentLevel);
    if (level) {
      setUserCode(level.starterCode);
      setShowHint(false);
      setFeedback(null);
    }
  }, [currentLevel]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to run code
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
      }
      // Ctrl/Cmd + R to reset code
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        handleReset();
      }
      // Escape to close level selector
      if (event.key === 'Escape' && showLevelSelector) {
        setShowLevelSelector(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLevelSelector]);

  // Simple code execution simulation
  const executeCode = (code: string) => {
    try {
      // Simulate Python print statements
      const printRegex = /print\((.*?)\)/g;
      const matches: string[] = [];
      let match;

      while ((match = printRegex.exec(code)) !== null) {
        let value = match[1].trim();

        // Handle different types of print statements
        if (value.startsWith("'") && value.endsWith("'")) {
          // String literal
          matches.push(value.slice(1, -1));
        } else if (value.startsWith('"') && value.endsWith('"')) {
          // String literal
          matches.push(value.slice(1, -1));
        } else if (value.match(/^\d+$/)) {
          // Number literal
          matches.push(value);
        } else if (value.includes('f\'') || value.includes('f"')) {
          // F-string simulation
          if (code.includes('name = \'Python\'') || code.includes('name = "Python"')) {
            matches.push(value.replace(/f['"]Hello, \{name\}!['"]/, 'Hello, Python!'));
          }
          if (code.includes('color = input(')) {
            matches.push('Your favorite color is blue');
          }
        } else if (value.includes('+')) {
          // Mathematical operations
          try {
            const result = eval(value);
            matches.push(result.toString());
          } catch {
            matches.push(value);
          }
        } else if (code.includes('fruits[1]')) {
          matches.push('banana');
        } else if (code.includes('[1, 2, 3, 4]')) {
          matches.push('[1, 2, 3, 4]');
        } else if (code.includes('person[\'name\']')) {
          matches.push('Alice');
        } else if (code.includes('.upper()')) {
          matches.push('PYTHON PROGRAMMING');
        } else {
          // Variable or expression
          if (code.includes('age = 25')) matches.push('25');
          if (code.includes('Hello!')) matches.push('Hello!');
          if (code.includes('Hello, World!')) matches.push('Hello, World!');
          if (code.includes('Yes, 10 is greater than 5')) matches.push('Yes, 10 is greater than 5');
        }
      }

      // Handle loops
      if (code.includes('for i in range(1, 4)')) {
        matches.push('1', '2', '3');
      }
      if (code.includes('while count <= 3')) {
        matches.push('1', '2', '3');
      }
      if (code.includes('for num in numbers:') && code.includes('print(num * 2)')) {
        matches.push('2', '4', '6', '8', '10');
      }

      return matches.join('\n');
    } catch (error: any) {
      return "Error: " + error.message;
    }
  };

  const handleSubmit = async () => {
    const level = levels.find(l => l.id === currentLevel);
    if (!level) return;

    // Set loading state
    setFeedback({
      type: 'loading',
      message: t('evaluatingCode')
    });

    try {
      // Fallback to simple output comparison
      const output = executeCode(userCode);
      const isCorrect = output.trim() === level.expectedOutput.trim();

      if (isCorrect) {
        setCompletedLevels(prev => new Set([...prev, currentLevel]));
        setStreak(prev => prev + 1);
        setFeedback({
          type: 'success',
          message: t('excellentComplete'),
          output: output
        });
      } else {
        setStreak(0);
        setFeedback({
          type: 'error',
          message: t('notQuiteRight'),
          output: output,
          expected: level.expectedOutput,
          explanation: level.hint
        });
      }
    } catch (error) {
      console.error('Error evaluating code:', error);
      setFeedback({
        type: 'error',
        message: 'An error occurred while evaluating your code.',
        explanation: 'Please check your syntax and try again.'
      });
    }
  };

  const handleReset = () => {
    const level = levels.find(l => l.id === currentLevel);
    if (level) {
      setUserCode(level.starterCode);
      setFeedback(null);
      setShowHint(false);
    }
  };

  const handleLevelChange = (levelId: number) => {
    // Only allow access to level 1 or completed levels or the next uncompleted level
    const maxUnlockedLevel = Math.max(1, Math.max(...Array.from(completedLevels)) + 1);
    if (levelId <= maxUnlockedLevel) {
      setCurrentLevel(levelId);
      setShowLevelSelector(false);
    }
  };

  const currentLevelData = levels.find(l => l.id === currentLevel);
  const progressPercentage = (completedLevels.size / levels.length) * 100;

  if (!currentLevelData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-blue-600">{t('appTitle')}</h1>
              <div className="hidden md:flex items-center space-x-2 text-gray-600">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">{completedLevels.size}/{levels.length} {t('levelsProgress')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-orange-700">{streak}</span>
                <span className="text-orange-600 text-sm">{t('streakLabel')}</span>
              </div>
              <button
                onClick={() => setShowLevelSelector(!showLevelSelector)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('levelButton')} {currentLevel}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{t('overallProgress')}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Level Selector Modal */}
      {showLevelSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('selectLevel')}</h2>
                <button
                  onClick={() => setShowLevelSelector(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  {t('closeButton')}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levels.map((level) => {
                  const isCompleted = completedLevels.has(level.id);
                  const isLocked = level.id > Math.max(1, Math.max(...Array.from(completedLevels)) + 1);
                  const isCurrentLevel = level.id === currentLevel;

                  return (
                    <button
                      key={level.id}
                      onClick={() => !isLocked && handleLevelChange(level.id)}
                      disabled={isLocked}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${isCurrentLevel
                        ? 'border-blue-500 bg-blue-50'
                        : isCompleted
                          ? 'border-green-500 bg-green-50 hover:bg-green-100'
                          : isLocked
                            ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                            : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-gray-600">{t('levelButton')} {level.id}</span>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : null}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{level.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{level.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Instructions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {t('levelButton')} {currentLevel}: {currentLevelData.title}
                </h2>
                {completedLevels.has(currentLevel) && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
              <p className="text-gray-600 mb-4">{currentLevelData.description}</p>

              {/* Concept Explanation */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <span className="mr-2">📚</span>
                  {t('conceptLabel').replace('📚 ', '')}
                </h3>
                <div className="text-purple-700 leading-relaxed">
                  {currentLevelData.concept.split('\n').map((line, index) => {
                    // Check if line is code (starts with certain patterns or contains code indicators)
                    const isCodeLine = line.trim().startsWith('print(') ||
                      line.trim().startsWith('age =') ||
                      line.trim().startsWith('name =') ||
                      line.trim().startsWith('for ') ||
                      line.trim().startsWith('while ') ||
                      line.trim().startsWith('if ') ||
                      line.trim().startsWith('def ') ||
                      line.trim().startsWith('numbers =') ||
                      line.trim().startsWith('fruits =') ||
                      line.trim().startsWith('person =') ||
                      line.trim().startsWith('text =') ||
                      line.trim().startsWith('count =') ||
                      line.trim().startsWith('contador =') ||
                      line.trim().startsWith('edad =') ||
                      line.trim().startsWith('nombre =') ||
                      line.trim().startsWith('numeros =') ||
                      line.trim().startsWith('frutas =') ||
                      line.trim().startsWith('persona =') ||
                      line.trim().startsWith('texto =') ||
                      line.includes('# ') ||
                      line.trim().startsWith('    ') ||
                      line.includes('range(') ||
                      line.includes('.append(') ||
                      line.includes('.upper()') ||
                      line.includes('input(') ||
                      (line.includes('Muestra:') || line.includes('Shows:')) ||
                      line.includes('+ - * /') ||
                      line.includes('> (') ||
                      line.includes('< (') ||
                      line.includes('== (');

                    if (isCodeLine) {
                      return (
                        <div key={index} className="my-2">
                          <pre className="bg-gray-800 text-green-400 p-3 rounded-lg text-sm font-mono overflow-x-auto border-l-4 border-green-500">
                            {line}
                          </pre>
                        </div>
                      );
                    }

                    // Handle section headers (Example:, Ejemplo:)
                    if (line.trim().startsWith('Example:') || line.trim().startsWith('Ejemplo:')) {
                      return (
                        <div key={index} className="mt-4 mb-2">
                          <h4 className="font-semibold text-purple-800 flex items-center">
                            <span className="mr-2">💡</span>
                            {line.trim()}
                          </h4>
                        </div>
                      );
                    }

                    // Regular text
                    return line.trim() ? (
                      <p key={index} className="mb-2 text-purple-700">
                        {line}
                      </p>
                    ) : (
                      <div key={index} className="mb-2"></div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-800 mb-2">{t('taskLabel')}</h3>
                <p className="text-blue-700">{currentLevelData.task}</p>
              </div>
            </div>

            {/* Hint Section */}
            <div className="mb-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                <Lightbulb className="w-5 h-5" />
                <span className="font-medium">{showHint ? t('hideHint') : t('showHint')}</span>
              </button>
              {showHint && (
                <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <p className="text-yellow-800">{currentLevelData.hint}</p>
                </div>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg mb-6 ${feedback.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : feedback.type === 'loading'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-red-50 border border-red-200'
                }`}>
                <p className={`font-medium mb-2 ${feedback.type === 'success'
                  ? 'text-green-800'
                  : feedback.type === 'loading'
                    ? 'text-blue-800'
                    : 'text-red-800'
                  }`}>
                  {feedback.message}
                </p>
                {feedback.explanation && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-700">{feedback.explanation}</p>
                  </div>
                )}
                {feedback.output && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">{t('yourOutput')}</p>
                    <pre className="bg-gray-100 p-2 rounded text-sm font-mono">{feedback.output}</pre>
                  </div>
                )}
                {feedback.expected && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">{t('expectedOutput')}</p>
                    <pre className="bg-gray-100 p-2 rounded text-sm font-mono">{feedback.expected}</pre>
                  </div>
                )}
                {feedback.hint && feedback.type === 'error' && (
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>{t('tipLabel')}</strong> {feedback.hint}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Code Editor */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t('pythonCodeEditor')}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Ctrl+Enter to run • Ctrl+R to reset
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors text-sm"
                  title="Reset code (Ctrl+R)"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('resetButton')}</span>
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-500 px-3 py-1 rounded transition-colors text-sm"
                  title="Run code (Ctrl+Enter)"
                >
                  <Play className="w-4 h-4" />
                  <span>{t('runCodeButton')}</span>
                </button>
              </div>
            </div>
            <div className="p-0">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 border-0 resize-none focus:outline-none focus:ring-0"
                placeholder={t('codeEditorPlaceholder')}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => currentLevel > 1 && handleLevelChange(currentLevel - 1)}
            disabled={currentLevel === 1}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('previousLevel')}
          </button>
          <div className="text-center">
            <p className="text-gray-600">
              {t('levelOf').replace('{current}', currentLevel.toString()).replace('{total}', levels.length.toString())}
            </p>
          </div>
          <button
            onClick={() => {
              if (completedLevels.has(currentLevel) && currentLevel < levels.length) {
                handleLevelChange(currentLevel + 1);
              }
            }}
            disabled={!completedLevels.has(currentLevel) || currentLevel === levels.length}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('nextLevel')}
          </button>
        </div>
      </main>
    </div>
  );
};

export default PyLingo;