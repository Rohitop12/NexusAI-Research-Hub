<?php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Overview');
    })->name('dashboard');

    Route::get('/dashboard/search', function () {
        return Inertia::render('Dashboard/Search');
    })->name('dashboard.search');

    Route::get('/dashboard/chat', function () {
        return Inertia::render('Dashboard/Chatbot');
    })->name('dashboard.chat');

    Route::get('/dashboard/upload', function () {
        return Inertia::render('Dashboard/Upload');
    })->name('dashboard.upload');

    Route::get('/dashboard/graph', function () {
        return Inertia::render('Dashboard/Graph');
    })->name('dashboard.graph');

    Route::get('/dashboard/analytics', function () {
        return Inertia::render('Dashboard/Analytics');
    })->name('dashboard.analytics');

    // Document Insight Page Route
    Route::get('/dashboard/document/{id}', function ($id) {
        $document = \App\Models\Document::findOrFail($id);
        return Inertia::render('Dashboard/DocumentInsight', [
            'document' => $document
        ]);
    })->name('dashboard.document');

    // API Routes
    Route::get('/api/documents', [\App\Http\Controllers\Api\DocumentController::class, 'index'])->name('api.documents.index');
    Route::post('/api/documents/upload', [\App\Http\Controllers\Api\DocumentController::class, 'upload'])->name('api.documents.upload');
    Route::post('/api/documents/{id}/chat', [\App\Http\Controllers\Api\DocumentChatController::class, 'message'])->name('api.documents.chat');
    Route::post('/api/search', [\App\Http\Controllers\Api\SearchController::class, 'search'])->name('api.search');
    Route::post('/api/chat/message', [\App\Http\Controllers\Api\ChatController::class, 'message'])->name('api.chat.message');
    Route::get('/api/graph/data', [\App\Http\Controllers\Api\GraphController::class, 'data'])->name('api.graph.data');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
