<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;
use Gemini\Laravel\Facades\Gemini;

class ChatController extends Controller
{
    public function message(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'array'
        ]);

        $userMessage = $request->input('message');
        $history = $request->input('history', []);

        // Fallback simulated responses
        $responses = [
            "Based on the internal documents, the thermal stability of solid-state lithium batteries improves significantly when using a ceramic electrolyte, increasing the threshold by up to 150°C.",
            "Our most recent NLP fine-tuning experiments (Project Delta) achieved a 94% accuracy rate on medical diagnostic datasets.",
            "I've searched the R&D database. The latest guidelines on Quantum Computing materials are located in the Physics division's Confluence space. Would you like me to summarize them?",
            "That's a great question. According to the Q3 Research Report, the cost of synthesizing the new graphene-based polymer has decreased by 22% due to improved catalyst efficiency."
        ];

        // 1. Check if Gemini API key is configured
        if (!config('gemini.api_key')) {
            sleep(1);
            return response()->json([
                'message' => $responses[array_rand($responses)],
                'sources' => ['Nexus R&D Database (Simulated)'],
                'is_simulated' => true
            ]);
        }

        try {
            // 2. Build context from history
            $prompt = "You are Nexus AI, an expert enterprise R&D assistant. You help researchers analyze documents and find data. Use a professional, futuristic, and helpful tone.\n\n";
            
            foreach ($history as $msg) {
                $sender = $msg['sender'] ?? 'user';
                $role = $sender === 'user' ? 'User' : 'Nexus AI';
                $prompt .= "{$role}: " . ($msg['text'] ?? '') . "\n";
            }
            
            $prompt .= "User: {$userMessage}\nNexus AI:";

            // 3. Call Gemini
            $result = Gemini::generativeModel('gemini-flash-latest')->generateContent($prompt);

            return response()->json([
                'message' => $result->text(),
                'sources' => ['Nexus Intelligence Engine (Gemini)'],
                'is_simulated' => false
            ]);

        } catch (\Exception $e) {
            \Log::error('Gemini Error: ' . $e->getMessage());
            
            return response()->json([
                'message' => "I encountered an error connecting to the Gemini brain, so I'm using my local fallback: " . $responses[array_rand($responses)],
                'sources' => ['Local Backup Intelligence'],
                'is_simulated' => true
            ]);
        }
    }
}
