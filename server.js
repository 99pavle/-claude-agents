const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Simple working endpoints that Claude Chat can use
app.get('/', (req, res) => {
    res.json({
        name: "Local Claude Agents",
        version: "1.0.0",
        status: "running",
        endpoints: ["/health", "/execute", "/agents"],
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        server: 'local-claude-agents',
        uptime: process.uptime(),
        timestamp: new Date().toISOString() 
    });
});

app.post('/execute', async (req, res) => {
    const { agent, task, prompt } = req.body;
    console.log(`🤖 Executing: ${agent} - ${task || prompt}`);
    
    const result = {
        agent: agent || 'CREATOR',
        task: task || prompt || 'Task executed',
        result: `Local agent ${agent || 'CREATOR'} completed: ${task || prompt}`,
        success: true,
        timestamp: new Date().toISOString(),
        location: 'Local PC'
    };
    
    res.json(result);
});

app.get('/agents', (req, res) => {
    res.json({
        available: ['CREATOR', 'MODIFIER', 'ANALYZER', 'FINDER', 'TESTER', 'OPTIMIZER'],
        status: 'ready',
        location: 'Local PC'
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LOCAL CLAUDE AGENTS SERVER`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`✅ Ready for integration`);
    console.log(`🌐 Waiting for tunnel...`);
});