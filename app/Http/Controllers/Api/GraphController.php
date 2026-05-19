<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GraphController extends Controller
{
    public function data(Request $request)
    {
        // Simulated Knowledge Graph data derived from R&D corpus
        $nodes = [
            ['id' => '1', 'position' => ['x' => 400, 'y' => 100], 'data' => ['label' => 'Artificial Intelligence'], 'type' => 'input', 'style' => ['background' => '#0055FF', 'color' => '#fff', 'border' => 'none', 'borderRadius' => '12px', 'padding' => '15px', 'fontWeight' => 'bold']],
            ['id' => '2', 'position' => ['x' => 200, 'y' => 250], 'data' => ['label' => 'NLP Models'], 'style' => ['background' => '#1A1A20', 'color' => '#fff', 'border' => '1px solid rgba(255,255,255,0.1)', 'borderRadius' => '8px', 'padding' => '10px']],
            ['id' => '3', 'position' => ['x' => 600, 'y' => 250], 'data' => ['label' => 'Computer Vision'], 'style' => ['background' => '#1A1A20', 'color' => '#fff', 'border' => '1px solid rgba(255,255,255,0.1)', 'borderRadius' => '8px', 'padding' => '10px']],
            ['id' => '4', 'position' => ['x' => 100, 'y' => 400], 'data' => ['label' => 'LLM Fine-Tuning'], 'style' => ['background' => '#121215', 'color' => '#FFD600', 'border' => '1px solid rgba(255,214,0,0.3)', 'borderRadius' => '8px', 'padding' => '10px']],
            ['id' => '5', 'position' => ['x' => 300, 'y' => 400], 'data' => ['label' => 'Semantic Search'], 'style' => ['background' => '#121215', 'color' => '#0055FF', 'border' => '1px solid rgba(0,85,255,0.3)', 'borderRadius' => '8px', 'padding' => '10px']],
            ['id' => '6', 'position' => ['x' => 500, 'y' => 400], 'data' => ['label' => 'Medical Diagnostics'], 'style' => ['background' => '#121215', 'color' => '#fff', 'border' => '1px solid rgba(255,255,255,0.1)', 'borderRadius' => '8px', 'padding' => '10px']],
            ['id' => '7', 'position' => ['x' => 700, 'y' => 400], 'data' => ['label' => 'Robotics'], 'style' => ['background' => '#121215', 'color' => '#fff', 'border' => '1px solid rgba(255,255,255,0.1)', 'borderRadius' => '8px', 'padding' => '10px']],
        ];

        $edges = [
            ['id' => 'e1-2', 'source' => '1', 'target' => '2', 'animated' => true, 'style' => ['stroke' => '#0055FF']],
            ['id' => 'e1-3', 'source' => '1', 'target' => '3', 'animated' => true, 'style' => ['stroke' => '#0055FF']],
            ['id' => 'e2-4', 'source' => '2', 'target' => '4', 'style' => ['stroke' => 'rgba(255,255,255,0.2)']],
            ['id' => 'e2-5', 'source' => '2', 'target' => '5', 'style' => ['stroke' => 'rgba(255,255,255,0.2)']],
            ['id' => 'e3-6', 'source' => '3', 'target' => '6', 'style' => ['stroke' => 'rgba(255,255,255,0.2)']],
            ['id' => 'e3-7', 'source' => '3', 'target' => '7', 'style' => ['stroke' => 'rgba(255,255,255,0.2)']],
            ['id' => 'e4-6', 'source' => '4', 'target' => '6', 'animated' => true, 'style' => ['stroke' => '#FFD600', 'strokeWidth' => 2]],
        ];

        return response()->json([
            'nodes' => $nodes,
            'edges' => $edges
        ]);
    }
}
