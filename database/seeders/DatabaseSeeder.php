<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'admin@example.com',
        ]);

        Project::factory(3)->create();

        $projects = [
            [
                'custom_id' => '#OC_03Y',
                'title' => 'INTERNAL_AUTOMATION',
                'slug' => 'internal-automation',
                'description' => 'Engineered enterprise management flows for hardware provisioning and desktop virtualization. Focused on high-concurrency background automation.',
                'tags' => ['ROR', 'DOCKER', 'SIDEKIQ'],
                'status' => 'OC_COCKPIT',
                'status_color' => 'text-tertiary bg-tertiary-container/10'
            ],
            [
                'custom_id' => '#DEG_01',
                'title' => 'PROJECT_ORCHESTRATOR',
                'slug' => 'project-orchestrator',
                'description' => 'A full-stack management suite focused on organizational logic. Features dynamic team allocation, permission-centric security (PBAC), and high-utility data dashboards.',
                'tags' => ['LARAVEL', 'PBAC', 'BLADE'],
                'status' => 'DEGREE_PROJECT',
                'status_color' => 'text-secondary bg-secondary-container/10'
            ],
            [
                'custom_id' => '#NODE_CH_01',
                'title' => 'SELF_HOSTED_INFRA',
                'slug' => 'self-hosted-infra',
                'description' => 'A secure Ubuntu environment hosting this portfolio and high-concurrency game servers. Managed via a local-only Cockpit instance, shielded by a private WireGuard VPN node on a Raspberry Pi gateway.',
                'tags' => ['LINUX', 'WIREGUARD', 'NGINX'],
                'status' => 'HOME_NODE',
                'status_color' => 'text-error bg-error-container/10'
            ]
        ];

        foreach ($projects as $p) {
            Project::create($p);
        }

    }
}
