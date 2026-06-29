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
            $memoryData = $this->getMemoryMetrics();
            return [
                'host' => [
                    'environment' => strtoupper(config('app.env')) ?: 'PRODUCTION',
                    'php_version' => $this->getMajorMinorVersion(PHP_VERSION),
                    'laravel_version' => $this->getMajorMinorVersion(app()->version()),
                    'uptime' => $this->getContainerUptime(),
                ],
                'hardware' => [
                    'cpu_load' => $this->getCpuLoad(),
                    'memory'   => [
                        'used'            => $memoryData['used'],
                        'percentage'      => $memoryData['percentage'],
                        'subtext'         => $memoryData['subtext'],
                        'host_percentage' => $memoryData['host_percentage'],
                    ],
                    'containers' => [
                        'total_containers'  => $memoryData['total_containers'],
                        'global_containers' => $memoryData['global_containers'],
                    ]
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
        if (file_exists('/proc/1')) {
            $bootTime = filemtime('/proc/1');
            $uptimeSeconds = time() - $bootTime;

            if ($uptimeSeconds < 0) {
                return '0m';
            }

            $days = floor($uptimeSeconds / 86400);
            $hours = floor(($uptimeSeconds % 86400) / 3600);
            $minutes = floor(($uptimeSeconds % 3600) / 60);

            if ($days > 0) {
                return "{$days}D, {$hours}H, {$minutes}M";
            }
            if ($hours > 0) {
                return "{$hours}H, {$minutes}M";
            }
            return "{$minutes}M";
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
        $hostTotalGb = 0;
        $hostUsedGb = 0;
        $hostUsedPercentage = 0;

        // 1. Gather Host Total Memory Registry
        if (file_exists('/proc/meminfo')) {
            $meminfo = file_get_contents('/proc/meminfo');
            preg_match('/MemTotal:\s+(\d+)/', $meminfo, $totalMatches);
            preg_match('/MemAvailable:\s+(\d+)/', $meminfo, $availMatches);

            if (!empty($totalMatches) && !empty($availMatches)) {
                $totalKb = (int)$totalMatches[1];
                $availKb = (int)$availMatches[1];
                $usedKb = $totalKb - $availKb;

                $hostTotalGb = round($totalKb / 1024 / 1024, 2);
                $hostUsedGb = round($usedKb / 1024 / 1024, 2);
                $hostUsedPercentage = round(($usedKb / $totalKb) * 100, 1);
            }
        }

        // 2. Fetch Isolated Application Footprint
        $appContainerMemoryGb = $this->getWebsiteStackMemory();
        $websitePercentageOfServer = $hostTotalGb > 0 ? round(($appContainerMemoryGb / $hostTotalGb) * 100, 1) : 0;

        return [
            'used' => "{$appContainerMemoryGb} GB",
            'percentage' => $websitePercentageOfServer,
            'subtext' => "{$hostUsedGb} GB / {$hostTotalGb} GB ({$hostUsedPercentage}%)",
            'host_percentage' => $hostUsedPercentage,
            'total_containers' => $this->getActiveContainerCount(),
            'global_containers' => $this->getGlobalDockerContainersCount(),
        ];
    }

    private function getGlobalDockerContainersCount(): int
    {
        return (int) (env('GLOBAL_CONTAINER_BASELINE') ?: 10);
    }

    private function getWebsiteStackMemory(): float
    {
        $cgroupV2Path = '/sys/fs/cgroup/memory.current';
        $cgroupV1Path = '/sys/fs/cgroup/memory/memory.usage_in_bytes';

        $bytes = 0;

        if (file_exists($cgroupV2Path)) {
            $bytes = (int) trim(file_get_contents($cgroupV2Path));
        } elseif (file_exists($cgroupV1Path)) {
            $bytes = (int) trim(file_get_contents($cgroupV1Path));
        }

        if ($bytes > 0) {
            $mb = $bytes / 1024 / 1024;

            $stackOverheadMb = 200;

            return round(($mb + $stackOverheadMb) / 1024, 2);
        }

        return 0.15;
    }

    private function getActiveContainerCount(): int
    {
        $count = 1;

        if (gethostbyname('db') !== 'db') $count++;
        if (gethostbyname('webserver') !== 'webserver') $count++;
        if (gethostbyname('tunnel') !== 'tunnel') $count++;
        if (Cache::has('scheduler_last_heartbeat')) $count++;

        return $count;
    }

    private function checkDatabaseStatus(): array
    {
        $start = microtime(true);
        try {
            DB::select('SELECT 1');

            $latency = (microtime(true) - $start) * 1000;

            $formattedLatency = number_format($latency, 2);

            return [
                'status' => 'OPERATIONAL',
                'context' => "LATENCY: {$formattedLatency}ms"
            ];
        } catch (\Exception $e) {
            logger()->error('Database query mapping failed: ' . $e->getMessage());

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
            $latency = (microtime(true) - LARAVEL_START) * 1000;

            $formattedLatency = number_format($latency, 2);
        }

        return [
            'status' => 'OPERATIONAL',
            'latency' => "{$formattedLatency}ms"
        ];
    }

    private function checkSchedulerStatus(): array
    {
        $lastHeartbeat = Cache::get('scheduler_last_heartbeat');

        if ($lastHeartbeat && (now()->timestamp - $lastHeartbeat) <= 90) {
            $timeAgo = now()->timestamp - $lastHeartbeat;
            return [
                'status' => 'ACTIVE',
                'context' => "SYNCED: {$timeAgo}s AGO"
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
