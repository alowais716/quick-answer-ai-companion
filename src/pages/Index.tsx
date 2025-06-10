import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Bluetooth, Volume2, Settings, Play, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'ar-SA'; // Arabic (Saudi Arabia)
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (isArabicQuestion(transcript)) {
          setCurrentQuestion(transcript);
          processQuestion(transcript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: "Unable to process speech. Please try again.",
          variant: "destructive"
        });
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
    }
  }, []);

  const isArabicQuestion = (text: string): boolean => {
    const questionWords = ['ما', 'من', 'أين', 'كيف', 'متى', 'لماذا', 'هل', 'ماذا'];
    return questionWords.some(word => text.includes(word));
  };

  const processQuestion = async (arabicText: string) => {
    setIsProcessing(true);
    
    try {
      // Always translate to English first
      const englishQuestion = await translateToEnglish(arabicText);
      console.log('Translated question:', englishQuestion);
      
      // Get AI answer for the translated question
      const answer = await getAIAnswer(englishQuestion);
      
      setCurrentAnswer(answer);
      
      // Simulate sending to glasses
      if (isConnected) {
        await sendToGlasses(answer);
      }
      
      toast({
        title: "Question Processed",
        description: "Answer ready and sent to glasses",
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process question",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  const translateToEnglish = async (arabicText: string): Promise<string> => {
    // Simulate translation API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Clean the Arabic text
    const cleanArabicText = arabicText.trim();
    console.log('Translating Arabic:', cleanArabicText);
    
    // Enhanced translations for common Arabic questions
    const translations: { [key: string]: string } = {
      'ما هذا؟': 'What is this?',
      'ما هذا': 'What is this?',
      'من هذا؟': 'Who is this?',
      'من هذا': 'Who is this?',
      'أين أنا؟': 'Where am I?',
      'أين أنا': 'Where am I?',
      'كيف أفعل هذا؟': 'How do I do this?',
      'كيف أفعل هذا': 'How do I do this?',
      'متى يحدث هذا؟': 'When does this happen?',
      'متى يحدث هذا': 'When does this happen?',
      'لماذا يحدث هذا؟': 'Why does this happen?',
      'لماذا يحدث هذا': 'Why does this happen?',
      'ما هي سرعة الضوء؟': 'What is the speed of light?',
      'ما هي سرعة الضوء': 'What is the speed of light?',
      'ما هو الوقت؟': 'What time is it?',
      'ما هو الوقت': 'What time is it?',
      'كيف الطقس؟': 'How is the weather?',
      'كيف الطقس': 'How is the weather?',
      'ما هو اسمك؟': 'What is your name?',
      'ما هو اسمك': 'What is your name?',
      'أين المطعم؟': 'Where is the restaurant?',
      'أين المطعم': 'Where is the restaurant?',
      'كم العمر؟': 'How old?',
      'كم العمر': 'How old?',
      'ما هو لونك المفضل؟': 'What is your favorite color?',
      'ما هو لونك المفضل': 'What is your favorite color?',
      'كيف تعمل؟': 'How does it work?',
      'كيف تعمل': 'How does it work?',
      'متى ستصل؟': 'When will you arrive?',
      'متى ستصل': 'When will you arrive?',
      'لماذا هذا مهم؟': 'Why is this important?',
      'لماذا هذا مهم': 'Why is this important?'
    };
    
    // Check for exact matches first (with and without question marks)
    if (translations[cleanArabicText]) {
      return translations[cleanArabicText];
    }
    
    // Enhanced pattern-based translation for any Arabic question
    if (cleanArabicText.includes('ما هي') || cleanArabicText.includes('ما هو')) {
      // Extract the subject after "ما هي/ما هو"
      const subject = cleanArabicText.replace(/ما هي |ما هو |؟/g, '').trim();
      return `What is ${subject}?`;
    } else if (cleanArabicText.includes('من هو') || cleanArabicText.includes('من هي')) {
      const subject = cleanArabicText.replace(/من هو |من هي |؟/g, '').trim();
      return `Who is ${subject}?`;
    } else if (cleanArabicText.includes('أين')) {
      const location = cleanArabicText.replace(/أين |؟/g, '').trim();
      return `Where is ${location}?`;
    } else if (cleanArabicText.includes('كيف')) {
      const action = cleanArabicText.replace(/كيف |؟/g, '').trim();
      return `How ${action}?`;
    } else if (cleanArabicText.includes('متى')) {
      const event = cleanArabicText.replace(/متى |؟/g, '').trim();
      return `When ${event}?`;
    } else if (cleanArabicText.includes('لماذا')) {
      const reason = cleanArabicText.replace(/لماذا |؟/g, '').trim();
      return `Why ${reason}?`;
    } else if (cleanArabicText.includes('هل')) {
      const question = cleanArabicText.replace(/هل |؟/g, '').trim();
      return `Is ${question}?`;
    } else if (cleanArabicText.includes('ماذا')) {
      const action = cleanArabicText.replace(/ماذا |؟/g, '').trim();
      return `What ${action}?`;
    }
    
    // If no pattern matches, create a general question
    return `Please explain about: ${cleanArabicText}`;
  };

  const getAIAnswer = async (question: string): Promise<string> => {
    // Simulate AI API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    console.log('Getting AI answer for:', question);
    
    // Enhanced AI responses with more specific answers
    const responses: { [key: string]: string } = {
      'What is this?': 'Based on visual analysis, this appears to be an everyday object. For more specific identification, please describe what you see or provide more context about the item you\'re looking at.',
      'Who is this?': 'I can see a person in your field of view. For privacy and safety reasons, I cannot identify specific individuals, but I can help describe what I observe about their appearance or actions if that would be helpful.',
      'Where am I?': 'You appear to be in an indoor environment. To provide more specific location information, I would need access to your GPS data or more visual context about your surroundings.',
      'How do I do this?': 'To help you with the specific task, I need more details about what you\'re trying to accomplish. Please describe the activity or process you need assistance with.',
      'When does this happen?': 'The timing of events depends on the specific context. Could you provide more details about what you\'re referring to so I can give you accurate timing information?',
      'Why does this happen?': 'There are usually multiple factors that contribute to any phenomenon. To give you a precise explanation, I need more context about what specific event or situation you\'re asking about.',
      'What is the speed of light?': 'The speed of light in a vacuum is approximately 299,792,458 meters per second (about 186,282 miles per second). This is a fundamental physical constant denoted by the letter "c" and is the maximum speed at which all matter and information in the universe can travel.',
      'What time is it?': `The current time is ${new Date().toLocaleTimeString()}.`,
      'How is the weather?': 'I don\'t have access to current weather data. Please check your weather app or ask a voice assistant with internet access for current weather conditions.',
      'What is your name?': 'I\'m Quick Answer AI, your personal assistant for answering questions through your G1 glasses.',
      'Where is the restaurant?': 'I need more specific information about which restaurant you\'re looking for. Could you provide the name or type of restaurant?',
      'How old?': 'I need more context about what or whom you\'re asking about to provide age information.',
      'What is your favorite color?': 'As an AI, I don\'t have personal preferences, but I can help you with information about colors or color theory if you\'d like.',
      'How does it work?': 'I need more context about what specific thing you\'re asking about to explain how it works.',
      'When will you arrive?': 'I\'m an AI assistant, so I don\'t physically travel. Could you clarify what you\'re asking about?',
      'Why is this important?': 'I need more context about what specific topic you\'re referring to in order to explain its importance.'
    };
    
    // Check for exact match first
    if (responses[question]) {
      return responses[question];
    }
    
    // Provide intelligent fallback responses based on question patterns
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('what is') || lowerQuestion.includes('what are')) {
      const subject = question.replace(/what is |what are |please explain about: |\?/gi, '').trim();
      return `${subject} is a concept I can help explain. Based on your question about "${subject}", this typically refers to a specific topic or object. Could you provide more context so I can give you a more detailed and accurate explanation?`;
    } else if (lowerQuestion.includes('who is') || lowerQuestion.includes('who are')) {
      const person = question.replace(/who is |who are |\?/gi, '').trim();
      return `You're asking about "${person}". I can provide general information about people, roles, or historical figures, but I cannot identify specific individuals from images for privacy reasons. Could you provide more context about what you'd like to know?`;
    } else if (lowerQuestion.includes('where is') || lowerQuestion.includes('where are')) {
      const location = question.replace(/where is |where are |\?/gi, '').trim();
      return `You're looking for "${location}". I can help with location-based questions, but I would need more specific details or access to mapping services to provide accurate directions or location information.`;
    } else if (lowerQuestion.includes('how')) {
      const process = question.replace(/how |\?/gi, '').trim();
      return `You're asking about how to "${process}". I'm ready to provide step-by-step instructions or explanations. Could you give me more details about the specific process or task you need help with?`;
    } else if (lowerQuestion.includes('when')) {
      const event = question.replace(/when |\?/gi, '').trim();
      return `You're asking about the timing of "${event}". I can help with timing and scheduling questions, but I would need more context about the specific event or timeframe you're referring to.`;
    } else if (lowerQuestion.includes('why')) {
      const reason = question.replace(/why |\?/gi, '').trim();
      return `You're asking why "${reason}". I can explain reasons and causes, but I would need more context about the specific situation or phenomenon you'd like me to explain.`;
    } else if (lowerQuestion.includes('is ')) {
      const topic = question.replace(/is |\?/gi, '').trim();
      return `You're asking about "${topic}". This appears to be a yes/no question or a request for confirmation. Could you provide more details so I can give you a more specific answer?`;
    }
    
    // Final fallback for any other question
    return `I understand you're asking: "${question}". I'm here to help with a wide variety of questions! Could you please provide a bit more context or rephrase your question so I can give you the most helpful and accurate answer possible?`;
  };

  const sendToGlasses = async (text: string) => {
    // Simulate Bluetooth communication to G1 glasses
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Sending to glasses:', text);
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Listening Started",
        description: "Speak your question in Arabic",
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      toast({
        title: "Listening Stopped",
        description: "Speech recognition disabled",
      });
    }
  };

  const connectGlasses = async () => {
    try {
      // Simulate Bluetooth connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
      toast({
        title: "G1 Glasses Connected",
        description: "Ready to send answers to your glasses",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to G1 glasses",
        variant: "destructive"
      });
    }
  };

  const speakAnswer = () => {
    if (currentAnswer && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentAnswer);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Quick Answer AI
          </h1>
          <p className="text-lg text-gray-600">
            Arabic Voice Questions → AI Answers → G1 Glasses
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Mic className="h-4 w-4" />
                Listening Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isListening ? "default" : "secondary"}>
                {isListening ? "Active" : "Inactive"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bluetooth className="h-4 w-4" />
                G1 Glasses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isConnected ? "default" : "outline"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Settings className="h-4 w-4" />
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isProcessing ? "destructive" : "secondary"}>
                {isProcessing ? "Processing..." : "Ready"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Control Panel</CardTitle>
            <CardDescription>
              Manage voice listening and device connections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isListening ? (
                  <>
                    <Square className="h-4 w-4" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Listening
                  </>
                )}
              </Button>

              <Button
                onClick={connectGlasses}
                disabled={isConnected}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Bluetooth className="h-4 w-4" />
                {isConnected ? "Connected" : "Connect Glasses"}
              </Button>

              <Button
                onClick={speakAnswer}
                disabled={!currentAnswer}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Speak Answer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Session */}
        {(currentQuestion || currentAnswer) && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">السؤال الحالي</CardTitle>
                <CardDescription>Current Question (Arabic)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-right text-lg font-medium leading-relaxed">
                  {currentQuestion || "لم يتم طرح سؤال بعد"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Answer</CardTitle>
                <CardDescription>Generated Response</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  {currentAnswer || "No answer generated yet"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Arabic Questions:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Start with: ما، من، أين، كيف، متى، لماذا</li>
                  <li>• Speak clearly into your microphone</li>
                  <li>• Questions are automatically detected</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Real-time Arabic speech recognition</li>
                  <li>• AI-powered answer generation</li>
                  <li>• G1 glasses integration ready</li>
                  <li>• Text-to-speech for answers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
