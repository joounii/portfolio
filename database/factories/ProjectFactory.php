<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->unique()->words(2, true);
        return [
            'custom_id' => '#' . strtoupper($this->faker->bothify('??_##')),
            'title' => strtoupper(str_replace(' ', '_', $title)),
            'slug' => Str::slug($title),
            'description' => $this->faker->sentence(15),
            'tags' => $this->faker->randomElements(['REACT', 'LARAVEL', 'PYTHON', 'AWS', 'REDIS', 'GO'], 3),
            'status' => $this->faker->randomElement(['STABLE', 'BETA_TEST', 'DEPRECATED', 'ACTIVE_NODE']),
            'status_color' => 'text-primary bg-primary/10',
            'active_page_id' => null,
        ];
    }
}
