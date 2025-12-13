#!/usr/bin/env node
// Cross-platform kill-port script using platform-specific commands.
// Usage: node ./scripts/kill-port.js <port>

import { execSync } from 'child_process';

const port = process.argv[2];
if (!port) {
    console.error('Usage: node kill-port.js <port>');
    process.exit(1);
}

try {
    if (process.platform === 'win32') {
        // netstat -ano | findstr :<port>
        const out = execSync(`netstat -ano | findstr ":${port}"`, { encoding: 'utf8' });
        const lines = out.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    #!/usr/bin / env node
        // Simple cross-platform kill-port helper.
        // Usage: node ./scripts/kill-port.js <port>

        import { execSync } from 'child_process';

        const port = process.argv[2];
        if (!port) {
            console.error('Usage: node kill-port.js <port>');
            process.exit(1);
        }

        try {
            if (process.platform === 'win32') {
                // Windows: use netstat to find PID(s), then taskkill
                const out = execSync(`netstat -ano | findstr ":${port}"`, { encoding: 'utf8' });
                const lines = out.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                const pids = new Set();
                for (const line of lines) {
                    const parts = line.split(/\s+/);
                    const pid = parts[parts.length - 1];
                    if (pid && pid !== '0') pids.add(pid);
                }
                if (pids.size === 0) {
                    console.log(`No process found listening on port ${port}`);
                    process.exit(0);
                }
                for (const pid of pids) {
                    console.log(`Killing PID ${pid} on Windows`);
                    execSync(`taskkill /PID ${pid} /F`);
                }
                console.log(`Port ${port} freed`);
                process.exit(0);
            } else {
                // Unix-like: try lsof
                try {
                    const out = execSync(`lsof -ti :${port}`, { encoding: 'utf8' }).trim();
                    if (!out) {
                        console.log(`No process found listening on port ${port}. If lsof is not installed, try: sudo lsof -i :${port} or ss -ltnp | grep ":${port}"`);
                        process.exit(0);
                    }
                    const pids = out.split(/\r?\n/).map(p => p.trim()).filter(Boolean);
                    for (const pid of pids) {
                        console.log(`Killing PID ${pid} on Unix`);
                        execSync(`kill -9 ${pid}`);
                    }
                    console.log(`Port ${port} freed`);
                    process.exit(0);
                } catch (e) {
                    console.warn('lsof not available or failed to list processes. Please run one of these commands manually:');
                    console.warn(`  sudo lsof -i :${port}`);
                    console.warn(`  sudo ss -ltnp | grep ":${port}"`);
                    process.exit(1);
                }
            }
        } catch (err) {
            console.error('Failed to kill port:', err.message || err);
            process.exit(1);
        }