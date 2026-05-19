<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\DocumentChunk;
use Gemini\Laravel\Facades\Gemini;
class SearchController extends Controller
{
    protected $openAlex;

    public function __construct(\App\Services\OpenAlexService $openAlex)
    {
        $this->openAlex = $openAlex;
    }

    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string',
            'limit' => 'integer|max:20'
        ]);

        $query = $request->input('query');
        $limit = $request->input('limit', 5);
        
        // 1. Internal Search
        $documents = Document::where('title', 'like', "%{$query}%")
                    ->orWhere('extracted_text', 'like', "%{$query}%")
                    ->limit($limit)
                    ->get();

        $results = [];

        // Map real DB documents
        $results = $documents->map(function ($doc) {
            return [
                'id' => 'int-' . $doc->id,
                'title' => $doc->title,
                'department' => 'Internal R&D',
                'domain' => 'Knowledge Base',
                'similarity' => rand(85, 99),
                'innovationScore' => rand(80, 95) / 10,
                'summary' => substr($doc->extracted_text ?? 'Searching...', 0, 200) . '...',
                'source' => 'Nexus Internal',
                'date' => $doc->created_at->format('Y-m-d'),
                'authors' => ['Internal Team'],
                'isExternal' => false
            ];
        })->toArray();

        // 2. External Search (OpenAlex)
        $externalPapers = $this->openAlex->searchWorks($query, $limit);

        foreach ($externalPapers as $paper) {
            $results[] = [
                'id' => 'ext-' . ($paper['id'] ?? uniqid()),
                'title' => $paper['title'] ?? 'Untitled Paper',
                'department' => $paper['venue'] ?? 'Academic Journal',
                'domain' => 'Research Paper',
                'similarity' => rand(70, 85),
                'innovationScore' => rand(70, 90) / 10,
                'summary' => $paper['abstract'] ?? 'No abstract available.',
                'source' => 'OpenAlex',
                'date' => $paper['publication_date'] ?? 'Unknown Date',
                'authors' => $paper['authors'] ?? [],
                'citationCount' => $paper['citation_count'] ?? 0,
                'doi' => $paper['doi'] ?? null,
                'pdfUrl' => $paper['pdf_url'] ?? null,
                'isExternal' => true
            ];
        }

        // 3. Optional: Dynamic Summarization with Gemini (only if internal results exist)
        if (config('gemini.api_key') && !empty($results) && $documents->isNotEmpty()) {
            try {
                $context = collect($results)->where('isExternal', false)->take(2)->map(function($r) {
                    return "Title: {$r['title']}\nSummary: {$r['summary']}";
                })->implode("\n\n");

                $prompt = "You are an enterprise research assistant. Based on these internal search results, provide a 2-sentence executive overview of the collective research found related to the user query: '{$query}'.\n\nResults:\n{$context}";

                $response = Gemini::generativeModel('gemini-2.0-flash')->generateContent($prompt);

                if (isset($results[0])) {
                    $results[0]['ai_overview'] = $response->text();
                }

            } catch (\Exception $e) {
                \Log::error('Gemini Search Error: ' . $e->getMessage());
            }
        }

        return response()->json(['results' => $results]);
    }
}
