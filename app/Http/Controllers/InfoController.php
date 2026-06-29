<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class InfoController extends Controller
{
    public function getMetrics(): JsonResponse
    {
        $stats = Cache::remember('infra_telemetry', 10, function () {
            return [
                'host' => [
                    'environment' => config('app.env') ?: 'PRODUCTION',
                    'php_version' => $this->getMajorMinorVersion(PHP_VERSION),
                    'laravel_version' => $this->getMajorMinorVersion(app()->version()),
                    'uptime' => $this->getContainerUptime(),
                ],
                'hardware' => [
                    'cpu_load' => $this->getCpuLoad(),
                    'memory' => $this->getMemoryMetrics(),
                ],
                'daemons' => [
                    'php_fpm'           => $this->checkPhpFpmStatus(),
                    'mysql'             => $this->checkDatabaseStatus(),
                    'scheduler'         => $this->checkSchedulerStatus(),
                    'cloudflare_tunnel' => $this->checkCloudflareTunnelStatus(),
                ]
            ];
        });

        return response()->json($stats);
    }

    private function getMajorMinorVersion(string $version): string
    {
        $parts = explode('.', $version);

        if (count($parts) >= 2) {
            return $parts[0] . '.' . $parts[1];
        }

        return $version;
    }

    private function getContainerUptime(): string
    {
        if (file_exists('/proc/uptime')) {
            $uptimeSeconds = (float) explode(' ', file_get_contents('/proc/uptime'))[0];

            $days = floor($uptimeSeconds / 86400);
            $hours = floor(($uptimeSeconds % 86400) / 3600);
            $minutes = floor(($uptimeSeconds % 3600) / 60);

            if ($days > 0) {
                return "{$days}d, {$hours}h, {$minutes}m";
            }
            return "{$hours}h, {$minutes}m";
        }
        return 'UNKNOWN';
    }

    private function getCpuLoad(): float
    {
        if (file_exists('/proc/loadavg')) {
            $load = explode(' ', file_get_contents('/proc/loadavg'));
            return round((float)$load[0] * 10, 1);
        }
        return 0.0;
    }

    private function getMemoryMetrics(): array
    {
        if (file_exists('/proc/meminfo')) {
            $meminfo = file_get_contents('/proc/meminfo');
            preg_match('/MemTotal:\s+(\d+)/', $meminfo, $totalMatches);
            preg_match('/MemAvailable:\s+(\d+)/', $meminfo, $availMatches);

            if (!empty($totalMatches) && !empty($availMatches)) {
                $totalKb = (int)$totalMatches[1];
                $availKb = (int)$availMatches[1];
                $usedKb = $totalKb - $availKb;

                $usedGb = round($usedKb / 1024 / 1024, 2);
                $totalGb = round($totalKb / 1024 / 1024, 2);
                $percentage = round(($usedKb / $totalKb) * 100, 1);

                return [
                    'used' => "{$usedGb} GB",
                    'subtext' => "CONTAINER NODE MAX: {$totalGb} GB ({$percentage}%)",
                    'percentage' => $percentage
                ];
            }
        }
        return ['used' => '0 GB', 'subtext' => 'UNAVAILABLE', 'percentage' => 0];
    }

    private function checkDatabaseStatus(): array
    {
        $start = microtime(true);
        try {
            DB::connection()->getPdo();
            $latency = round((microtime(true) - $start) * 1000);
            return [
                'status' => 'OPERATIONAL',
                'context' => "PORT 3406 // {$latency}ms"
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'DISCONNECTED',
                'context' => 'CRITICAL_ALERT'
            ];
        }
    }

    private function checkPhpFpmStatus(): array
    {
        $latency = 0;
        if (defined('LARAVEL_START')) {
            $latency = round((microtime(true) - LARAVEL_START) * 1000);
        }

        return [
            'status' => 'OPERATIONAL',
            'latency' => "{$latency}ms"
        ];
    }

    private function checkSchedulerStatus(): array
    {
        $lastHeartbeat = Cache::get('scheduler_last_heartbeat');

        if ($lastHeartbeat && (now()->timestamp - $lastHeartbeat) <= 90) {
            $timeAgo = now()->timestamp - $lastHeartbeat;
            return [
                'status' => 'ACTIVE',
                'context' => "SYNCED // {$timeAgo}s AGO"
            ];
        }

        return [
            'status' => 'STALLED',
            'context' => 'CHECK_CONTAINER_CRON'
        ];
    }

    private function checkCloudflareTunnelStatus(): array
    {
        $host = 'tunnel';
        $port = 2000;
        $connectionTimeout = 0.5;

        $fp = @fsockopen($host, $port, $errno, $errstr, $connectionTimeout);

        if ($fp) {
            fclose($fp);
            return [
                'status' => 'SHIELDED',
                'context' => 'PROXY_NODE_UP'
            ];
        }

        if (gethostbyname('tunnel') !== 'tunnel') {
            return [
                'status' => 'SHIELDED',
                'context' => 'TUNNEL_ROUTED'
            ];
        }

        return [
            'status' => 'UNSECURED',
            'context' => 'TUNNEL_OFFLINE'
        ];
    }
}
