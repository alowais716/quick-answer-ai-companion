
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
      // Simulate translation to English
      const englishQuestion = await translateToEnglish(arabicText);
      
      // Simulate AI answer
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock translations for common Arabic questions
    const translations: { [key: string]: string } = {
      'ما هذا؟': 'What is this?',
      'من هذا؟': 'Who is this?',
      'أين أنا؟': 'Where am I?',
      'كيف أفعل هذا؟': 'How do I do this?',
      'متى يحدث هذا؟': 'When does this happen?',
      'لماذا يحدث هذا؟': 'Why does this happen?'
    };
    
    return translations[arabicText] || 'What is this about?';
  };

  const getAIAnswer = async (question: string): Promise<string> => {
    // Simulate AI API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI responses
    const responses: { [key: string]: string } = {
      'What is this?': 'This appears to be an object you are looking at. I would need more context to provide a specific answer.',
      'Who is this?': 'This is a person in your field of view. I cannot identify specific individuals for privacy reasons.',
      'Where am I?': 'You appear to be in an indoor/outdoor location. For specific location details, please check your GPS.',
      'How do I do this?': 'To complete this task, follow the standard procedure or consult the relevant documentation.',
      'When does this happen?': 'The timing depends on the specific context of what you are referring to.',
      'Why does this happen?': 'This occurs due to various factors that would need more context to explain specifically.'
    };
    
    return responses[question] || 'I need more information to provide a helpful answer.';
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
