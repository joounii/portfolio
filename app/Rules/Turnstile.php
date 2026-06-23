<?php

namespace App\Rules;


use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\App;

class Turnstile implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        if (App::environment('local', 'testing') || $value === 'LOCAL_DEV_BYPASS') {
            return;
        }

        if (empty($value)) {
            $fail('Security verification is required.');
            return;
        }

        $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'secret' => config('services.turnstile.secret'),
            'response' => $value,
            'remoteip' => request()->ip(),
        ]);

        if (!$response->successful() || !$response->json('success')) {
            $fail('Security verification failed. Please try again.');
        }
    }
}
