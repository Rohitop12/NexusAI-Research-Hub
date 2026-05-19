<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAlexService
{
    protected $baseUrl = 'https://api.openalex.org';

    /**
     * Search for works (papers) by query using semantic search.
     */
    public function searchWorks(string $query, int $limit = 10)
    {
        try {
            // Using search.semantic for conceptual matching
            $response = Http::get("{$this->baseUrl}/works", [
                'search.semantic' => $query,
                'per_page' => $limit,
                'select' => 'id,title,abstract_inverted_index,authorships,cited_by_count,primary_location,publication_date,doi'
            ]);

            if ($response->successful()) {
                $data = $response->json()['results'] ?? [];
                
                return collect($data)->map(function ($work) {
                    return [
                        'id' => $work['id'],
                        'title' => $work['title'],
                        'abstract' => $this->reconstructAbstract($work['abstract_inverted_index'] ?? []),
                        'authors' => collect($work['authorships'] ?? [])->map(fn($a) => $a['author']['display_name'])->toArray(),
                        'citation_count' => $work['cited_by_count'] ?? 0,
                        'pdf_url' => $work['primary_location']['pdf_url'] ?? null,
                        'publication_date' => $work['publication_date'] ?? null,
                        'doi' => $work['doi'] ?? null,
                        'venue' => $work['primary_location']['source']['display_name'] ?? 'Academic Source'
                    ];
                })->toArray();
            }

            Log::error('OpenAlex API Error: ' . $response->body());
            return [];
        } catch (\Exception $e) {
            Log::error('OpenAlex Exception: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Reconstructs the abstract from the inverted index format.
     */
    protected function reconstructAbstract(array $invertedIndex)
    {
        if (empty($invertedIndex)) return 'No abstract available.';

        $words = [];
        foreach ($invertedIndex as $word => $positions) {
            foreach ($positions as $pos) {
                $words[$pos] = $word;
            }
        }

        ksort($words);
        return implode(' ', $words);
    }
}
